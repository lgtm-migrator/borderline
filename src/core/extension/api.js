const url = require('url');

const http_api = require('./http');
const path_api = require('./path');
const fs_api = require('./filesystem');
const query_api = require('./query.js');
const objectStorage_api = require('./objectStorage.js');

function BorderlineApi(pluginUuid, gridFSObjectStorage) {
    this.url = url;
    this.http = http_api.http;
    this.https = http_api.https;
    this.path = path_api;
    this.fs = new fs_api(pluginUuid);
    this.query = new query_api(pluginUuid);
    this.objectStorage = new objectStorage_api(gridFSObjectStorage);
}

module.exports = BorderlineApi;
