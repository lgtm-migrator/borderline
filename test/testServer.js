let express = require('express');
let BorderlineMiddleware = require('../src/borderlineMiddleware.js');
let config = require('../config/borderline.test.config.js');

function TestServer() {
    this._app = express();

    // Bind member functions
    this.start = TestServer.prototype.start.bind(this);
    this.stop = TestServer.prototype.stop.bind(this);
}

TestServer.prototype.start = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        // Setup node env to test during test
        process.env.TEST = 1;

        // Create borderline middlware service
        _this.borderline_middleware = new BorderlineMiddleware(config);

        // Start serving on config.port
        _this._app.use(_this.borderline_middleware);
        _this.server = _this._app.listen(config.port, function(error) {
            if (error)
                reject(error);
            else
                resolve(true);
        });
    });
};

TestServer.prototype.stop = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        // Remove test flag from env
        delete process.env.TEST;

        _this._server.close(function(error) {
            if (error)
                reject(error);
            else
                resolve(true);
        });
    });
};

module.exports = TestServer;
