const http = require('http');
const url = require('url');

function PluginApi() {
    this.url = url;
    this.http = {
        request: http.request
    };
    this.fs = {
        open: null,
        openSync: null,
        close: null,
        closeSync: null,
        rm: null,
        rmSync: null,
        stat: null,
        statSync: null,
        readdir: null,
        readdirSync: null,
        read: null,
        readSync: null,
        write: null,
        writeSync: null
    };
}

module.exports = PluginApi;
