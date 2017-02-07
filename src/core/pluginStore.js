//External modules
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const zlib = require('zlib');
const adm_zip = require('adm-zip');

//Local modules
var Plugin = require('./plugin');

var PluginStore = function(pluginFolder) {
    this.plugins = [];
    this.pluginFolder = pluginFolder;
    this.router = express.Router();

    this._scanLocalFolder();
    if (global.config.development == true) {
        this._watchLocalFolder();
    }
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
    fs.watch(this.pluginFolder,
            {
                recursive: true,
                encoding: 'utf8',
                persistent: true
            },
            function(eventType, filename) {
                console.log(eventType);
                console.log(filename);
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
            that.plugins.push(plugin);
            that._attachPlugin(plugin);
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
/*
    if (zip.getEntry('package.json') === null) {
        return { error: 'Missing mandatory plugin file /package.json' };
    }
    */
    if (zip.getEntry('index.js') === null) {
        return { error: 'Missing mandatory plugin file /index.js' };
    }

    //Generate a non-colliding plugin UUID
    var pluginUuid = Math.floor(Math.random() * 0xffffffffffff).toString(16);
    while (that._findPluginById(pluginUuid) !== null)
        pluginUuid = Math.floor(Math.random() * 0xffffffffffff).toString(16);

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
    var that = this;
    var res = {error: 'Cannot delete plugin with ID' + uuid };

    this.plugins.some(function(p, idx) {
        if (p.uuid == uuid) {
            //Detach plugin
            if (that._detachPlugin(p) === true) {
                //Remove from array
                that.plugins.splice(idx, 1);
                //Remove local directory
                fs.removeSync(that.pluginFolder + '/' + uuid);
                res = {id: uuid};
                return true;
            }
        }
    });
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

    return {id : uuid};
};


module.exports = PluginStore;
