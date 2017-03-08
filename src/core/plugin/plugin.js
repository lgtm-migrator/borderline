const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const mongodb = require('mongodb');

const borderlineApiModule = require('./api');

function Plugin(Uuid, PluginPath) {
    this.uuid = Uuid;
    this.router = express.Router();
    this.pluginPath = PluginPath;

    this.container = null;
    this.borderlineApi = new borderlineApiModule(Uuid);
    this.pluginModule = this.importer(PluginPath);
    if (this.pluginModule !== null && this.pluginModule !== undefined)
        this.container = new this.pluginModule();
    else {
        console.error('Did not manage to evaluate plugin ' + Uuid + ' :' + PluginPath);
        var serverFile = path.join(PluginPath, 'index.js');
        var pluginExport = {
            borderline: this.borderlineApi,
            exports: {}
        };
        try {
            if (fs.existsSync(serverFile) === true) {
                var code = fs.readFileSync(serverFile);
                var imported = eval(code.toString());

                console.log(imported);

                //imported(pluginExport);
                this.pluginModule = imported;
                console.log(this.pluginModule);
                this.container = new this.pluginModule(pluginExport);
            }
        }
        catch (err) {
            console.error('Hard import failed: ' + err);
        }
    }

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

Plugin.prototype.importer = function(importPath) {
    var serverFile = path.join(importPath, 'index.js');
    var pluginExport = {};
    try {
        if (fs.existsSync(serverFile) === true) {
            var code1 = '(function (borderline, module, __filename, __directory) { ';
            var code2 = '});';
            var code = fs.readFileSync(serverFile);
            var imported = eval(code1 + code + code2);

            imported(this.borderlineApi, pluginExport, 'index.js', importPath);
            return pluginExport.exports;
        }
    }
    catch (err) {
        return null;
    }
    return null;
};

Plugin.prototype.attach = function() {
    if (this.container) {
        this.container.attach(this.router);
    }
    var that = this;
    this.router.get('/*', function(req, res) {
        var url = req.params[0];
        if (req.params[0] === null || req.params[0] === undefined || req.params[0].length === 0) {
            url = 'index.html';
        }
        var resourcePath = that.pluginPath + '/' + url;
        if (resourcePath.indexOf('..') === -1 && fs.existsSync(resourcePath) === true) {
            return res.sendFile(resourcePath);
        }
        res.status(404);
        res.json({ error: 'Unresolved plugin internal path /' + url } );
    });
};

Plugin.prototype.detach = function() {
    if (this.container) {
        this.container.detach();
    }
};

module.exports = Plugin;
