var express = require('express');
var fs = require('fs');
var path = require('path');

class Plugin {
    constructor(PluginPath) {
        this.uuid = Math.floor(Math.random()*0xffffffff).toString(16);

        var module = require.resolve(PluginPath);
        console.log(module);
        console.log(require.cache[module]);
//        delete require.cache[require.resolve(PluginPath)];
        this.package = require(PluginPath + "/package.json");
        this.controller = require(PluginPath);

        this.router = express.Router();

        this.controller.init(this.router);
        this.controller.static(this.router, function (staticPath) {
            console.log(path.join(path.normalize(PluginPath) + path.normalize(staticPath)));
            return express.static(path.join(path.normalize(PluginPath) + path.normalize(staticPath)));
        });

        console.log("Plugin uuid = " + this.uuid);
    }
}

module.exports = Plugin;
