const express = require('express');
const mongodb = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;
const timer = require('timers');
const ip = require('ip');

const body_parser = require('body-parser');
const defines = require('./defines.js');
const package_file = require('../package.json');
const Options = require('./core/options.js');

function BorderlineMiddleware(config) {
    this.config = new Options(config);
    this.app = express();

    //Bind member functions
    this._connectDb = BorderlineMiddleware.prototype._connectDb.bind(this);
    this._setupQueryEndpoints = BorderlineMiddleware.prototype._setupQueryEndpoints.bind(this);
    this._registryHandler = BorderlineMiddleware.prototype._registryHandler.bind(this);

    //Setup Express Application
    //Parse JSON body when received
    this.app.use(body_parser.urlencoded({extended: true}));
    this.app.use(body_parser.json());

    //Removes default express headers
    this.app.set('x-powered-by', false);
    //Allow CORS request when enabled
    if (this.config.enableCors === true) {
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    var _this = this;
    this._connectDb().then(function() {
        _this._setupQueryEndpoints('/query');

        _this._registryHandler();
    }, function(error) {
        _this.app.all('*', function(req, res) {
            res.status(501);
            res.json(defines.errorStacker('Database connection failure', error));
        });
    });

    return this.app;
}

/**
 * @fn _registryHandler
 * @desc Setup a routine to update the global registry
 * Put a status object in the DB based on this current configuration
 * @private
 */
BorderlineMiddleware.prototype._registryHandler = function() {
    var _this = this;

    //Connect to the registry collection
    this.registry = this.db.collection(defines.globalRegistryCollectionName);
    var registry_update = function() {
        //Create status object
        var status = Object.assign({}, defines.registryModel, {
            type: 'borderline-middleware',
            version: package_file.version,
            timestamp: new Date(),
            expires_in: defines.registryUpdateInterval / 1000,
            port: _this.config.port,
            ip: ip.address().toString()
        });
        //Write in DB
        //Match by ip + port + type
        //Create if does not exists.
        _this.registry.findOneAndReplace({
            ip: status.ip,
            port: status.port,
            type: status.type
        }, status, { upsert: true, returnOriginal: false })
            .then(function(success) {
                //Nothing to do here
            }, function(error) {
                //Just log the error
                console.log(error);
            });
    };

    //Call the update every X milliseconds
    var interval_timer = timer.setInterval(registry_update, defines.registryUpdateInterval);
    //Do a first update now
    registry_update();

    return interval_timer;
};


/**
 * @fn _setupQueryEndpoints
 * @param prefix This string is appended before the uris definition
 * @private
 */
BorderlineMiddleware.prototype._setupQueryEndpoints = function(prefix) {
    var _this = this;

    //Import & instantiate controller modules
    var creationControllerModule = require('./creationController.js');
    _this.creationController = new creationControllerModule(_this.queryCollection, _this.grid);
    var endpointControllerModule = require('./endpointController.js');
    _this.endpointController = new endpointControllerModule(_this.queryCollection, _this.grid);
    var credentialsControllerModule = require('./credentialsController.js');
    _this.credentialsController = new credentialsControllerModule(_this.queryCollection, _this.grid);
    var inputControllerModule = require('./inputController.js');
    _this.inputController = new inputControllerModule(_this.queryCollection, _this.grid);
    var outputControllerModule = require('./outputController.js');
    _this.outputController = new outputControllerModule(_this.queryCollection, _this.grid);
    var executionControllerModule = require('./executionController.js');
    _this.executionController = new executionControllerModule(_this.queryCollection, _this.grid);

    //Setup controllers URIs
    _this.app.route(prefix + '/new')
        .get(_this.creationController.getNewQuery)
        .post(_this.creationController.postNewQuery);
    _this.app.route(prefix + '/new/:query_type')
        .post(_this.creationController.postNewQueryTyped);
    _this.app.route(prefix + '/:query_id/endpoint')
        .get(_this.endpointController.getQueryById)
        .put(_this.endpointController.putQueryById)
        .delete(_this.endpointController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/credentials')
        .get(_this.credentialsController.getQueryById)
        .put(_this.credentialsController.putQueryById)
        .delete(_this.credentialsController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/credentials/isAuth')
        .get(_this.credentialsController.getQueryAuthById);
    _this.app.route(prefix + '/:query_id/input')
        .get(_this.inputController.getQueryById)
        .put(_this.inputController.putQueryById)
        .delete(_this.inputController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/output')
        .get(_this.outputController.getQueryById)
        .put(_this.outputController.putQueryById)
        .delete(_this.outputController.deleteQueryById);
    _this.app.route('/execute')
        .post(_this.executionController.executeQuery);
    _this.app.route('/execute/:query_id')
        .get(_this.executionController.getQueryById);
};

/**
 * @fn _connectDb
 * @desc Setup the connections with mongoDB
 * @return {Promise} Resolves to true on success
 * @private
 */
BorderlineMiddleware.prototype._connectDb = function() {
    var _this = this;
    var urls_list = [
        this.config.mongoURL,
        this.config.objectStorageUrl
    ];
    return new Promise(function(resolve, reject) {
        //Create one Promise par DB to connect to
        var promises = [];
        for (var i = 0; i < urls_list.length; i++) {
            var p = new Promise(function(resolve, reject) {
                mongodb.connect(urls_list[i], function(err, db) {
                    if (err !== null)
                        reject(defines.errorStacker('Database connection failure', err));
                    else
                        resolve(db);
                });
            });
            promises.push(p);
        }
        //Resolve all promises in parallel
        Promise.all(promises).then(function(databases) {
            _this.db = databases[0];
            _this.queryCollection = _this.db.collection(defines.queryCollectionName);

            _this.objectDb = databases[1];
            _this.grid = new GridFSBucket(_this.objectDb, { bucketName: defines.globalStorageCollectionName });
            resolve(true);
        }, function (error) {
            reject(defines.errorStacker(error));
        });
    });
};

module.exports = BorderlineMiddleware;
