const express = require('express');
const mongodb = require('mongodb').MongoClient;
const multer = require('multer');
const body_parser = require('body-parser');
const { ErrorHelper, Constants, RegistryHelper } = require('borderline-utils');

const package_file = require('../package.json');
const Options = require('./core/options.js');
const ObjectStorage = require('./core/objectStorage.js');

function BorderlineMiddleware(config) {
    this.config = new Options(config);
    this.app = express();

    // Bind public member functions
    this.start = BorderlineMiddleware.prototype.start.bind(this);
    this.stop = BorderlineMiddleware.prototype.stop.bind(this);
    this.setupRegistry = BorderlineMiddleware.prototype.setupRegistry.bind(this);

    // Bind private member functions
    this._connectDb = BorderlineMiddleware.prototype._connectDb.bind(this);
    this._setupQueryEndpoints = BorderlineMiddleware.prototype._setupQueryEndpoints.bind(this);
    this._registryHandler = BorderlineMiddleware.prototype._registryHandler.bind(this);

    // Setup Express Application
    // Parse JSON body when received
    this.app.use(body_parser.urlencoded({ extended: true, limit: '1tb' }));
    this.app.use(body_parser.json());

    // Removes default express headers
    this.app.set('x-powered-by', false);
    // Allow CORS request when enabled
    if (this.config.enableCors === true) {
        this.app.use(function (__unused__req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }
}

/**
 * @fn start
 * @desc Starts the borderline middleware
 * @return {Promise} Resolves to a Express.js Application router on success,
 * rejects an error stack otherwise
 */
BorderlineMiddleware.prototype.start = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this._connectDb().then(function () {
            // Start status periodic update
            _this._registryHandler();

            // Setup route using controllers
            _this._setupQueryEndpoints('/query');
            _this.setupRegistry();

            _this.app.all('/*', function (__unused__req, res) {
                res.status(400);
                res.json(ErrorHelper('Bad request'));
            });

            resolve(_this.app); // All good, returns application
        }, function (error) {
            _this.app.all('*', function (__unused__req, res) {
                res.status(501);
                res.json(ErrorHelper('Database connection failure', error));
            });
            reject(ErrorHelper('Cannot establish mongoDB connection', error));
        });
    });
};

/**
 * @fn stop
 * @desc Stop the the borderline middleware
 * @return {Promise} Resolves to true on success,
 * rejects an error stack otherwise
 */
BorderlineMiddleware.prototype.stop = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        // Stop status update
        _this.registryHelper.stopPeriodicUpdate();

        // Disconnect DB --force
        _this.db.close(true).then(function (error) {
            if (error)
                reject(ErrorHelper('Closing mongoDB connection failed', error));
            else
                resolve(true);
        });
    });
};

/**
 * @fn _registryHandler
 * @desc Setup a routine to update the global registry
 * Put a status object in the DB based on this current configuration
 * @private
 */
BorderlineMiddleware.prototype._registryHandler = function () {
    let _this = this;

    // Connect to the registry collection
    _this.registryCollection = _this.db.collection(Constants.BL_GLOBAL_COLLECTION_REGISTRY);
    // Create RegistryHelper class
    _this.registryHelper = new RegistryHelper(Constants.BL_MIDDLEWARE_SERVICE, _this.registryCollection);
    // Sets properties in the registry
    _this.registryHelper.setModel({
        status: Constants.BL_SERVICE_STATUS_IDLE,
        version: package_file.version,
        port: _this.config.port
    });

    // Trigger updates
    _this.registryHelper.startPeriodicUpdate(Constants.BL_DEFAULT_REGISTRY_FREQUENCY);
};

/**
 * @fn setupRegistry
 * @desc Initialize the registry related routes
 */
BorderlineMiddleware.prototype.setupRegistry = function () {
    // Import the controller
    let registryController = require('./controllers/registryController.js');
    this.registryController = new registryController(this.registryHelper);

    this.app.get('/status', this.registryController.getServiceStatus);
    this.app.get('/details', this.registryController.getServiceDetails);
};

/**
 * @fn _setupQueryEndpoints
 * @param prefix This string is appended before the uris definition
 * @private
 */
BorderlineMiddleware.prototype._setupQueryEndpoints = function (prefix) {
    let _this = this;

    // Import & instantiate controller modules
    let queryControllerModule = require('./controllers/queryController.js');
    _this.queryController = new queryControllerModule(_this.queryCollection, _this.storage);
    let endpointControllerModule = require('./controllers/endpointController.js');
    _this.endpointController = new endpointControllerModule(_this.queryCollection, _this.storage);
    let credentialsControllerModule = require('./controllers/credentialsController.js');
    _this.credentialsController = new credentialsControllerModule(_this.queryCollection, _this.storage);
    let inputControllerModule = require('./controllers/inputController.js');
    _this.inputController = new inputControllerModule(_this.queryCollection, _this.storage);
    let outputControllerModule = require('./controllers/outputController.js');
    _this.outputController = new outputControllerModule(_this.queryCollection, _this.storage);
    let executionControllerModule = require('./controllers/executionController.js');
    _this.executionController = new executionControllerModule(_this.queryCollection, _this.storage);

    // Setup controllers URIs
    _this.app.route(prefix + '/new')
        .get(_this.queryController.getNewQuery)
        .post(_this.queryController.postNewQuery);
    _this.app.route(prefix + '/new/:query_type')
        .post(_this.queryController.postNewQueryTyped);
    _this.app.route(prefix + '/:query_id')
        .get(_this.queryController.getQueryById)
        .post(_this.queryController.postQueryById)
        .delete(_this.queryController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/endpoint')
        .get(_this.endpointController.getQueryById)
        .put(_this.endpointController.putQueryById)
        .delete(_this.endpointController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/credentials')
        .get(_this.credentialsController.getQueryById)
        .put(_this.credentialsController.putQueryById)
        .delete(_this.credentialsController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/input')
        .get(_this.inputController.getQueryById)
        .put(_this.inputController.putQueryById)
        .delete(_this.inputController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/output')
        .get(_this.outputController.getQueryById)
        .put(_this.outputController.putQueryById)
        .delete(_this.outputController.deleteQueryById);
    _this.app.route(prefix + '/:query_id/execute')
        .post(multer().single('file'), _this.executionController.executeQueryByID);
    _this.app.route(prefix + '/:query_id/status')
        .get(_this.executionController.getQueryStatusById);
    _this.app.route(prefix + '/*')
        .all(function (__unused__req, res) {
            res.status(400);
            res.json(ErrorHelper('Bad request'));
        });
};

/**
 * @fn _connectDb
 * @desc Setup the connections with mongoDB
 * @return {Promise} Resolves to true on success
 * @private
 */
BorderlineMiddleware.prototype._connectDb = function () {
    let _this = this;
    let urls_list = [
        this.config.mongoURL,
    ];
    return new Promise(function (resolve, reject) {
        //Create one Promise par DB to connect to
        let promises = [];
        for (let i = 0; i < urls_list.length; i++) {
            let p = new Promise(function (resolve, reject) {
                mongodb.connect(urls_list[i], function (err, db) {
                    if (err !== null)
                        reject(ErrorHelper('Database connection failure', err));
                    else
                        resolve(db);
                });
            });
            promises.push(p);
        }
        //Resolve all promises in parallel
        Promise.all(promises).then(function (databases) {
            _this.db = databases[0];
            _this.queryCollection = _this.db.collection(Constants.BL_MIDDLEWARE_COLLECTION_QUERY);
            _this.storage = new ObjectStorage({
                url: _this.config.swiftURL,
                username: _this.config.swiftUsername,
                password: _this.config.swiftPassword
            });

            resolve(true);
        }, function (error) {
            reject(ErrorHelper(error));
        });
    });
};

module.exports = BorderlineMiddleware;
