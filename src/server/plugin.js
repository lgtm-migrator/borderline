const express = require('express');
const fs = require('fs');
const path = require('path');

class Plugin {
    constructor(PluginPath) {
        this.uuid = Math.floor(Math.random()*0xffffffff).toString(16);
        this.package = require(PluginPath + "/package.json");
        this.router = express.Router();
        this.controller = require(PluginPath);

        this.controller.init(this.router);
        this.controller.static(this.router, function (staticPath) {
            console.log(path.join(path.normalize(PluginPath) + path.normalize(staticPath)));
            return express.static(path.join(path.normalize(PluginPath) + path.normalize(staticPath)));
        });

        console.log("Plugin uuid = " + this.uuid);
        console.log(this.package);
    }
}

module.exports = Plugin;
