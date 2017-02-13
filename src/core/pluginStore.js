//External modules
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const zlib = require('zlib');
const adm_zip = require('adm-zip');

//Local modules
var Plugin = require('./plugin/plugin');

var PluginStore = function(pluginCollection) {
    this.plugins = [];
    this.pluginFolder = path.normalize(global.config.pluginSourcesFolder);
    this.pluginCollection = pluginCollection;
    this.router = express.Router();

    this._scanLocalFolder();
    if (global.config.development == true) {
        this._watchLocalFolder();
    }
};

PluginStore.prototype._syncPlugin = function(plugin, operation) {
    var that = this;
    operation =  typeof operation !== 'undefined' ? operation : 'update';
    var model = {
        _id : plugin.uuid,
        sourcePath: plugin.pluginPath,
        filesPath: path.join(global.config.pluginFileSystemFolder, plugin.uuid),
        users: plugin.users ? plugin.users : []
    };

    return new Promise(function(resolve, reject) {
        if (operation === 'update' || operation === 'create') {
            that.pluginCollection.findOneAndReplace({_id: model._id}, model, {upsert: true}).then(
                function (success) {
                    resolve(success);
                },
                function (error) {
                    reject(error);
                }
            );
        }
        else if (operation === 'delete' ) {
            that.pluginCollection.findOneAndDelete({ _id: model._id }).then(
              function (success) {
                resolve(success);
              },
              function (error) {
                reject(error);
              }
            );
        }
        else {
            reject('Undefined plugin sync operation: ' + operation);
        }
    });
};


PluginStore.prototype._attachPlugin = function(plugin) {
    plugin.attach();
    this.router.use('/' + plugin.uuid, plugin.router);
};

PluginStore.prototype._detachPlugin = function(plugin) {
    plugin.detach();
    if (Array.isArray(this.router.stack)) {
        var pluginRoot = '/' + plugin.uuid;
        var index = this.router.stack.findIndex(function (layer) {
            if (layer.name === 'router' && pluginRoot.match(layer.regexp)) {
                return true;
            }
        });
        if (index !== -1) {
            this.router.stack.splice(index, 1);
            return true;
        }
    }
    return false;
};

PluginStore.prototype._findPluginById = function(id) {
    for (var i = 0; i < this.plugins.length; i++) {
        if (this.plugins[i].uuid === id)
            return this.plugins[i];
    }
    return null;
};

PluginStore.prototype._watchLocalFolder = function() {
    const pluginDirectoryExpr = /^(\w+)$/;

    var that = this;
    fs.watch(this.pluginFolder,
            {
                recursive: true,
                encoding: 'utf8',
                persistent: true
            },
            function(eventType, filename) {
                var pluginDirectory = filename.match(pluginDirectoryExpr);
                if (pluginDirectory) {
                    var uuid = pluginDirectory[0];
                    var pluginPath = path.join(that.pluginFolder, uuid);
                    var p = that._findPluginById(uuid);
                    if (p !== null) {
                        that._detachPlugin(p);
                        that.plugins.splice(that.plugins.findIndex(function(p) { return p.uuid == uuid }), 1);
                        if (fs.existsSync(pluginPath)) {
                            var new_plugin = new Plugin(uuid, pluginPath);
                            that._attachPlugin(new_plugin);
                            that.plugins.push(new_plugin);
                            that._syncPlugin(new_plugin, 'update');
                        }
                    }
                }
            }
    );
};

PluginStore.prototype._scanLocalFolder = function() {
    var dir_content = fs.readdirSync( this.pluginFolder );
    var that = this;

    dir_content.forEach(function(f) {
        var file = path.join(that.pluginFolder, f);
        var file_fd = fs.openSync(file, 'r');
        var file_stats = fs.fstatSync(file_fd);
        if (file_stats.isDirectory()) {
            var plugin = new Plugin(f, file);
            that._attachPlugin(plugin);
            that.plugins.push(plugin);
            that._syncPlugin(plugin, 'update');
        }
    });
};

PluginStore.prototype.listPlugins = function() {
    var pluginList = {
        count: 0,
        plugins : []
    };
    this.plugins.forEach(function(p) {
        pluginList.count++;
        pluginList.plugins.push(p.infos());
    });
    return pluginList;
};

PluginStore.prototype.createPluginFromFile = function(file) {
    var that = this;
    var buf = Buffer.from(file.buffer);
    var zip = new adm_zip(buf);

    if (zip.getEntry('index.js') === null) {
        return { error: 'Missing mandatory plugin file /index.js' };
    }

    //Generate a non-colliding plugin UUID
    var pluginUuid = Math.floor(Math.random() * 0xffffffffffffffffffffffff).toString(16);
    while (that._findPluginById(pluginUuid) !== null)
        pluginUuid = Math.floor(Math.random() * 0xffffffffffffffffffffffff).toString(16);

    zip.extractAllTo(that.pluginFolder + '/' + pluginUuid, true);

    var new_plugin = new Plugin(pluginUuid, that.pluginFolder + '/' + pluginUuid);
    that.plugins.push(new_plugin);
    that._attachPlugin(new_plugin);

    return {id: pluginUuid};
};

PluginStore.prototype.clearPlugins = function() {
    var that = this;
    this.plugins.forEach(function(plugin) {
        //Disconnect routes
        that._detachPlugin(plugin);
        //Remove local directory
        fs.removeSync(that.pluginFolder + '/' + plugin.uuid);
        //Remove from DB
        that._syncPlugin(plugin, 'delete');
    });
    this.plugins = [];
};

PluginStore.prototype.getPluginInfoById = function(id) {
    var  p = this._findPluginById(id);
    if (p !== null)
        return p.infos();
    return null;
};

PluginStore.prototype.deletePluginById = function(uuid) {
    var res = { error: 'Cannot delete plugin with ID ' + uuid };

    var p = this._findPluginById(uuid);
    if (p !== null) {
        if (this._detachPlugin(p) === true) {
            //Remove from DB
            this._syncPlugin(p, 'delete');
            //Remove from array
            this.plugins.splice(this.plugins.findIndex(function(p) { return p.uuid == uuid }), 1);
            //Remove local directory
            fs.removeSync(this.pluginFolder + '/' + uuid);
            res = {id: uuid};
        }
        else {
            res = { error: 'Detaching the plugin failed. ID ' + uuid };
        }
    }
    return res;
};

PluginStore.prototype.updatePluginById = function(uuid, file) {
    var buf = Buffer.from(file.buffer);
    var zip = new adm_zip(buf);
    /*
    if (zip.getEntry('package.json') === null) {
        return { error: 'Missing mandatory plugin file /package.json' };
    }
    */
    if (zip.getEntry('index.js') === null) {
        return { error: 'Missing mandatory plugin file /index.js' };
    }

    var delReply = this.deletePluginById(uuid);
    if (delReply.hasOwnProperty('error')) {
        return {error: 'Cannot update unknown plugin ID: ' + uuid };
    }

    zip.extractAllTo(this.pluginFolder + '/' + uuid, true);

    var new_plugin = new Plugin(uuid, this.pluginFolder + '/' + uuid);
    this._attachPlugin(new_plugin);
    this.plugins.push(new_plugin);
    //Insert in DB
    this._syncPlugin(new_plugin, 'create');

    return {id : uuid};
};


module.exports = PluginStore;
