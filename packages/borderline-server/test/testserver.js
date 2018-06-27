let express = require('express');
let BorderlineServer = require('../src/borderlineServer.js');
let config = require('../config/borderline.config');

function TestServer() {
    // Bind member vars
    this._app = express();
    this._cookies = [];

    // Bind public member functions
    this.run = TestServer.prototype.run.bind(this);
    this.stop = TestServer.prototype.stop.bind(this);
    this.mongo = TestServer.prototype.mongo.bind(this);
    this.getCookie = TestServer.prototype.getCookie.bind(this);
    this.setCookie = TestServer.prototype.setCookie.bind(this);
    this.clearCookie = TestServer.prototype.clearCookie.bind(this);
}

TestServer.prototype.run = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
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

TestServer.prototype.stop = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        // Remove test flag from env
        delete process.env.TEST;
        // Stop server & close connections
        _this.borderline_server.stop().then(function () {
            _this._web_server.close(function (error) {
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

TestServer.prototype.mongo = function () {
    return this.borderline_server.db;
};

TestServer.prototype.setCookie = function (response) {
    let _this = this;
    if (response && response.headers) {
        // Need to set a new cookie
        if (response.headers.hasOwnProperty('set-cookie')) {
            let set_cookies = response.headers['set-cookie'];
            set_cookies.forEach(function (cookie) {
                let cookie_array_value = cookie.split(';');
                _this._cookies.push(cookie_array_value[0]);
            });
        }

        // Processing current cookies
        if (response.headers.hasOwnProperty('Cookie')) {
            let current_cookies = response.headers['Cookie'];
            let current_cookie_array = current_cookies.split(';');
            _this._cookies = _this._cookies.merge(current_cookie_array);
        }
    }
};

TestServer.prototype.getCookie = function () {
    let _this = this;
    return _this._cookies.join(';');
};

TestServer.prototype.clearCookie = function () {
    let _this = this;
    _this._cookies = [];
};

module.exports = TestServer;
