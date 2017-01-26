var express = require('express');
var fs = require('fs-extra');
var path = require('path');

function Plugin(Uuid, PluginPath) {
    this.uuid = Uuid;
    this.metadata = require(PluginPath + '/package.json');
    this.controller = require(PluginPath);

    this.router = express.Router();

    this.controller.init(this.router);
    this.controller.static(this.router, function (staticPath) {
        var p = path.join(path.normalize(PluginPath) + path.normalize(staticPath));
        return express.static(p);
    });
};

Plugin.prototype.infos = function() {
        return {
            id: this.uuid,
            infos: this.metadata
        }
};

module.exports = Plugin;
