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

    //Importing the Plugin
    this.container = this.webpackImporter(PluginPath);
    if (this.container === null || this.container === undefined) { //Fallback for dev
        this.container = this.importer(PluginPath);
    }

    this.attach = Plugin.prototype.attach.bind(this);
    this.detach = Plugin.prototype.detach.bind(this);
    this.infos = Plugin.prototype.infos.bind(this);
}

Plugin.prototype.infos = function() {
    if (this.container === null || this.container === undefined) {
        return  {
            uuid: this.uuid,
            error: 'Plugin context is empty'
        };
    }

    return {
        uuid: this.uuid,
        id: this.container.id,
        compiled: this.container.compiled,
        router: this.router
    };
};

Plugin.prototype.webpackImporter = function(importPath) {
    try {
        var manifestPath = path.join(importPath, 'plugin.json');
        if (fs.existsSync(manifestPath) === false)
            return null;
        var manifestBytes = fs.readFileSync(manifestPath);
        var manifest = JSON.parse(manifestBytes);
        if (manifest === null || manifest === undefined ||
            manifest.id === null || manifest.id === undefined)
            return null;
        if (manifest.hasOwnProperty('server.js') == false || manifest.hasOwnProperty('client.js') == false)
            return null;

        var serverFile = path.join(importPath, manifest['server.js']);
        var clientFile = path.join(importPath, manifest['client.js']);

        if (fs.existsSync(serverFile) === true) {
            //Read server module form filesystem
            var code = fs.readFileSync(serverFile);
            //Define borderline in local scope so its found during eval
            var borderline = this.borderlineApi;
            //Evaluate server plugin Code
            var imported = eval(code.toString());

            //Create plugin container object
            var plugin = Object.assign({
                compiled: true,
                serverFile: serverFile,
                clientFile: clientFile,
                pluginPath: importPath,
                serverModule: new imported()
            }, manifest);

            return plugin; //Success
        }
    }
    catch (err) {
        console.error('Webpack plugin import failed: ' + err);
        return null;
    }
    return null;
};

Plugin.prototype.importer = function(importPath) {
    var serverFile = path.join(importPath, 'server.js');
    var clientFile = path.join(importPath, 'client.js');

    var mod = {};
    try {
        if (fs.existsSync(clientFile) === false)
            clientFile = null;

        if (fs.existsSync(serverFile) === true) {
            //Read server module form filesystem
            var code = fs.readFileSync(serverFile);

            var code_pre = '(function (borderline, module, __filename, __directory) { ';
            var code_post = '});';

            //Evaluate server plugin Code
            var imported = eval(code_pre + code + code_post);

            //Instanciate server module with boderline context
            imported(this.borderlineApi, mod, 'index.js', importPath);

            //Create plugin container object
            var plugin = {
                id: this.uuid,
                compiled: false,
                serverFile: serverFile,
                clientFile: clientFile,
                pluginPath: importPath,
                serverModule: new mod.exports()
            };
            return plugin; //Success
        }
    }
    catch (err) {
        console.error('Classic plugin import failed: ' + err);
        return null;
    }
    return null;
};

Plugin.prototype.attach = function() {
    var that = this;

    if (this.container) { //Dynamic plugin features
        if (this.container.serverModule) {
            this.container.serverModule.attach(this.router);
        }
        if (this.container.clientFile) {
            this.router.get('/client', function (req, res) {
                return res.sendFile(that.container.clientFile);
            });
        }
    }

    //Server all the other static files
    this.router.get('/*', function(req, res) {

        //Defaults to index.html
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
    if (this.container && this.container.serverModule) {
        this.container.serverModule.detach();
    }
};

module.exports = Plugin;
