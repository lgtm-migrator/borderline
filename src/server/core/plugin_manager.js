const fs = require('fs');
const path = require('path');
const express = require('express');
const express_remove = require('express-remove-route');

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
        var watcher = fs.watch(this.PluginDirectory, function(eventType, filename) {
            that.refresh();

            //Prevent triggering of multiple events for 250ms
            watcher.close();
            setTimeout(function() {
                that.watch();
            }, 250);
        });
    }

    find(pluginUuid) {
        this.Plugins.forEach(function(p) {
            if (p.uuid == pluginUuid)
                return true;
        });
        return false;
    }

    cleanup() {
        var that = this;

        //Removes plugins routes in use
        this.Plugins.forEach(function(p) {
            that.MainApp._router.stack.some(function (stack, idx) {
               // console.log(stack.handle);

                if (stack.path && stack.path.match( that.MountPoint + "/" + p.uuid )) {
                   that.MainApp._router.stack.splice(idx, 1);
                   return true;
               }
               return false;
            });
        });



        //Clear Plugin array
        this.Plugins = [];
    }

    refresh() {
        var that = this;

        this.cleanup();

        var dir_content = fs.readdirSync(this.PluginDirectory);
        dir_content.forEach(function(f) {
            var file = path.join(that.PluginDirectory, f);
            var file_fd = fs.openSync(file, "r");
            var file_stats = fs.fstatSync(file_fd);
            if (file_stats.isDirectory()) {
                console.log(file + " is a directory");
                var plugin = new Plugin(file);

                while (that.find(plugin.uuid)) //Regenerate plugin if we collide
                    plugin = new Plugin(file);

                that.MainApp.use(that.MountPoint + "/" + plugin.uuid, plugin.router);
                that.Plugins.push(plugin);
            }
            else
                console.log(file + " is a file");
        });

        console.log("Router stack = ");
        console.log( that.MainApp._router.stack );

        console.log("Last router stack handle");
        console.log( that.MainApp._router.stack[that.MainApp._router.stack.length - 1].handle);
    }

}

module.exports.pluginManager = PluginManager;
