const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const mongodb = require('mongodb');


var my_fs_module = {
    existsSync: function(path) { console.log('overload fs-extra ' + path); return false; }
};

var borderlineApi = {
    'fs-extra': my_fs_module,
    'fs': my_fs_module,
    'path': path,
    'mongodb': mongodb
};


function Plugin(Uuid, PluginPath) {
    this.uuid = Uuid;
    this.router = express.Router();

    this.pluginModule = this.importer(PluginPath);
    this.container = new this.pluginModule();

    this.attach = Plugin.prototype.attach.bind(this);
    this.detach = Plugin.prototype.detach.bind(this);
    this.infos = Plugin.prototype.infos.bind(this);
}

Plugin.prototype.infos = function() {
        return {
            id: this.uuid,
            meta: this.metadata,
            router: this.router
        }
};

Plugin.prototype.importer = function(path) {
    var code1 = '(function (borderline, module, __filename, __directory) {';
    var code2 = '});';
    var code = fs.readFileSync(path + '/index.js');
    var imported = eval(code1 + code + code2);
    var pluginExport = {};

    imported(borderlineApi, pluginExport, 'index.js', path);

    return pluginExport.exports;
};

Plugin.prototype.attach = function() {
    this.container.attach(borderlineApi, this.router);
    this.router.get('/*', function(req, res) {
        var url = req.params[0];
        if (req.params[0] === null || req.params[0] === undefined || req.params[0].length === 0) {
            url = 'index.html';
        }
        var path = PluginPath + '/' + url;
        if (path.indexOf('..') === -1 && fs.existsSync(path) === true) {
            return res.sendFile(path);
        }
        res.status(404);
        res.json({ error: 'Unresolved plugin internal path' } );
    });
};

Plugin.prototype.detach = function() {
    this.container.detach(borderlineApi);
};

module.exports = Plugin;
