let express = require('express');
let BorderlineMiddleware = require('../src/borderlineMiddleware.js');

function TestServer() {
    this._app = express();

    // Bind member functions
    this.start = TestServer.prototype.start.bind(this);
    this.stop = TestServer.prototype.stop.bind(this);
}

TestServer.prototype.start = function(config) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        // Setup node env to test during test
        process.env.TEST = 1;

        // Create borderline middleware service
        _this.borderline_middleware = new BorderlineMiddleware(config);

        _this._app.get('/ffs', function(req, res) {
            res.status(200);
            res.json({ ffs: true});
        });

        // Start serving on config.port
        _this.borderline_middleware.start().then(function(middleware_router) {
            _this._app.use(middleware_router);
            _this.server = _this._app.listen(config.port, function(error) {
                if (error)
                    reject(error);
                else {
                    resolve(true);
                    console.log('Test server listening on ' + config.port); // eslint-disable-line no-console
                }
            });
        }, function(error) {
            reject(error);
        });
    });
};

TestServer.prototype.stop = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        // Remove test flag from env
        delete process.env.TEST;

        _this.borderline_middleware.stop().then(function() {
            _this._server.close(function(error) {
                if (error)
                    reject(error);
                else
                    resolve(true);
            });
        }, function(error) {
            reject(error);
        });
    });
};

module.exports = TestServer;
