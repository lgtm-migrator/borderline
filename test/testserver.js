let express = require('express');
let BorderlineServer = require('../src/borderlineServer.js');
let config = require('../config/borderline.config');

function TestServer() {
    // Bind member vars
    this._app = express();

    // Bind public member functions
    this.run = TestServer.prototype.run.bind(this);
    this.stop = TestServer.prototype.stop.bind(this);
    this.mongo = TestServer.prototype.mongo.bind(this);
}

TestServer.prototype.run = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        // Setup node env to test during test
        process.env.TEST = 1;
        // Create server
        _this.borderline_server = new BorderlineServer(config);
        // Start server
        _this.borderline_server.start().then(function (router) {
            _this._app.use(router);
            _this._web_server = _this._app.listen(config.port, function (error) {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        }, function (error) {
            reject(error);
        });
    });
};

TestServer.prototype.stop = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        // Remove test flag from env
        delete process.env.TEST;
        // Stop server & close connections
        _this.borderline_server.stop().then(function() {
            _this._web_server.close(function(error) {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        }, function (error) {
            reject(error);
        });
    });
};

TestServer.prototype.mongo = function() {
    return this.borderline_server.db
};

module.exports = TestServer;
