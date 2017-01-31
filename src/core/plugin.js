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
var mod = require('module');

function pluginImporter(path) {
    var m = { _cache: borderlineApi, _load: function(request, parent, isMain) { return m._cache[request]; } };
    var r = function(reqPath) { return m._load(reqPath, m, false); };
    var e = {};
    var code1 = '(function (exports, require, module, __filename, __dirname) {';
    var code2 = '});';
    var code = fs.readFileSync(path + '/index.js');
    var imported = eval(code1 + code + code2);
    console.log(imported);
    imported(e, r, m, 'index.js', path);
    console.log(m.exports);
    return m.exports;
}

function Plugin(Uuid, PluginPath) {
    this.uuid = Uuid;
    this.router = express.Router();
    //this.metadata = require(PluginPath + '/package.json');

    this.pluginModule = pluginImporter(PluginPath);
    this.container = new this.pluginModule(borderlineApi);

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
}

Plugin.prototype.infos = function() {
        return {
            id: this.uuid,
            infos: this.metadata
        }
};

module.exports = Plugin;
