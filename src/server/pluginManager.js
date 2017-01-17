const fs = require('fs');
const path = require('path');
const express = require('express');

var Plugin = require("./plugin.js");

class PluginManager {

    constructor(MainApp, PluginDirectoryPath, MountPoint = "/api") {
        this.MainApp = MainApp;
        this.PluginDirectory = PluginDirectoryPath;
        this.MountPoint = MountPoint;
        this.Plugins = [];
        this.refresh();
    }

    watch() {
        var that = this;
        fs.watch(this.PluginDirectory, function(eventType, filename) {
            that.refresh();
        });
    }

    find(pluginUuid) {
        this.Plugins.forEach(function(p) {
            if (p.uuid == pluginUuid)
                return true;
        });
        return false;
    }

    refresh() {
        this.Plugins = [];
        var that = this;
        var dir_content = fs.readdirSync(this.PluginDirectory);

        console.log(dir_content);

        dir_content.forEach(function(f) {
            var file = path.join(that.PluginDirectory, f);
            var file_fd = fs.openSync(file, "r");
            var file_stats = fs.fstatSync(file_fd);
            if (file_stats.isDirectory()) {
                console.log(file + " is a directory");
                var plugin = new Plugin(file);

                while (that.find(plugin.uuid)) //Regenerate plugin if we collide
                    plugin = new Plugin(file);

                that.Plugins.push(plugin);
                that.MainApp.use(that.MountPoint + "/" + plugin.uuid, plugin.router);
            }
            else
                console.log(file + " is a file");
        });
    }

}

module.exports = PluginManager;
