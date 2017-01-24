var express = require('express');
var fs = require('fs-extra');
var path = require('path');

class Plugin {
    constructor(Uuid, PluginPath) {
        this.uuid = Uuid;
        this.metadata = require(PluginPath + "/package.json");
        this.controller = require(PluginPath);

        this.router = express.Router();

        this.controller.init(this.router);
        this.controller.static(this.router, function (staticPath) {
            return express.static(path.join(path.normalize(PluginPath) + path.normalize(staticPath)));
        });
    }

    infos() {
        return {
            id: this.uuid,
            infos: this.metadata
        }
    }
}

module.exports = Plugin;
