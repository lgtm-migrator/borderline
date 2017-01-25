//External modules
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const zlib = require('zlib');
const adm_zip = require('adm-zip');

//Local modules
var Plugin = require('./plugin');

class PluginStore {

    constructor(pluginFolder) {
        this.plugins = [];
        this.pluginFolder = pluginFolder;
        this.router = express.Router();

        this._scanLocalFolder();
    }

    _findPluginById(id) {
        for (var i = 0; i < this.plugins.length; i++) {
            if (this.plugins[i].uuid === id)
                return this.plugins[i];
        }
        return null;
    }

    _scanLocalFolder() {
        var dir_content = fs.readdirSync( this.pluginFolder );
        var that = this;

        dir_content.forEach(function(f) {
            var file = path.join(that.pluginFolder, f);
            var file_fd = fs.openSync(file, 'r');
            var file_stats = fs.fstatSync(file_fd);
            if (file_stats.isDirectory()) {
                var plugin = new Plugin(f, file);

                that.router.use('/' + plugin.uuid, plugin.router);
                that.plugins.push(plugin);
            }
        });
    }

    listPlugins() {
        var pluginList = {
            count: 0,
            plugins : []
        };
        this.plugins.forEach(function(p) {
            pluginList.count++;
            pluginList.plugins.push(p.infos());
        });
        return pluginList;
    }

    createPluginFromFile(file) {
        var that = this;
        var buf = Buffer.from(file.buffer);
        var zip = new adm_zip(buf);

        if (zip.getEntry('package.json') === null) {
            return { error: 'Missing mandatory plugin file /package.json' };
        }
        if (zip.getEntry('index.js') === null) {
            return { error: 'Missing mandatory plugin file /index.js' };
        }

        //Generate a non-colliding plugin UUID
        var pluginUuid = Math.floor(Math.random() * 0xffffffffffff).toString(16);
        while (that._findPluginById(pluginUuid) !== null)
            pluginUuid = Math.floor(Math.random() * 0xffffffffffff).toString(16);

        zip.extractAllTo(that.pluginFolder + '/' + pluginUuid);

        var new_plugin = new Plugin(pluginUuid, that.pluginFolder + '/' + pluginUuid);
        that.router.use('/' + new_plugin.uuid, new_plugin.router);
        that.plugins.push(new_plugin);

        return {id: pluginUuid};
    }

    clearPlugins(){
        this.plugins = [];
    }

    getPluginInfoById(id) {
        var  p = this._findPluginById(id);
        if (p !== null)
            return p.metadata;
        return null;
    }

    deletePluginById(uuid) {
        var that = this;
        var res = {error: `Cannot delete plugin with ID ${uuid}` };

        this.plugins.some(function(p, idx) {
            if (p.uuid == uuid) {
                that.plugins.splice(idx, 1);
                fs.removeSync(that.pluginFolder + '/' + uuid);
                res = {id: uuid};
                return true;
            }
        });
        return res;
    }

    updatePluginById(uuid, file) {
        var buf = Buffer.from(file.buffer);
        var zip = new adm_zip(buf);
        if (zip.getEntry('package.json') === null) {
            return { error: 'Missing mandatory plugin file /package.json' };
        }
        if (zip.getEntry('index.js') === null) {
            return { error: 'Missing mandatory plugin file /index.js' };
        }

        var delReply = this.deletePluginById(uuid);
        if (delReply.hasOwnProperty('error')) {
            return {error: `Cannot update unknown plugin ID: ${uuid}`};
        }

        zip.extractAllTo(this.pluginFolder + '/' + uuid);

        var new_plugin = new Plugin(uuid, this.pluginFolder + '/' + uuid);
        this.router.use('/' + new_plugin.uuid, new_plugin.router);
        this.plugins.push(new_plugin);

        return {id : uuid};
    }
}

module.exports = PluginStore;
