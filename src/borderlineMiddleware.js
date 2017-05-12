const express = require('express');
const mongodb = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;

const body_parser = require('body-parser');
const defines = require('./defines.js');

function BorderlineMiddleware(config) {
    this.config = config;
    this.app = express();

    //Bind member functions
    this._connectDb = BorderlineMiddleware.prototype._connectDb.bind(this);
    this._setupQueryEndpoints = BorderlineMiddleware.prototype._setupQueryEndpoints.bind(this);

    //Setup Express Application

    //Parse JSON body when received
    this.app.use(body_parser.urlencoded({extended: true}));
    this.app.use(body_parser.json());

    //Removes default express headers
    this.app.set('x-powered-by', false);
    //Allow CORS request when enabled
    if (this.config.enableCors === true) {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    var _this = this;
    this._connectDb().then(function() {
        _this._setupQueryEndpoints('/query');
    }, function(error) {
        _this.app.all('*', function(req, res) {
            res.status(501);
            res.json({ error: 'Database connection failure: ' + error});
        });
    });

    return this.app;
}

/**
 * @fn _setupQueryEndpoints
 * @param prefix This string is appended before the uris definition
 * @private
 */
BorderlineMiddleware.prototype._setupQueryEndpoints = function(prefix) {
    var _this = this;

    //Import & instantiate controller modules
    var endpointControllerModule = require('./endpointController.js');
    _this.endpointController = new endpointControllerModule(_this.queryCollection, _this.grid);
    var inputControllerModule = require('./inputController.js');
    _this.inputController = new inputControllerModule(_this.queryCollection, _this.grid);
    var outputControllerModule = require('./outputController.js');
    _this.outputController = new outputControllerModule(_this.queryCollection, _this.grid);
    var executionControllerModule = require('./executionController.js');
    _this.executionController = new executionControllerModule(_this.queryCollection, _this.grid);

    //Setup controllers URIs
    _this.app.route(prefix + '/new')
        .get(_this.inputController.getNewQuery)
        .post(_this.inputController.postNewQuery);
    _this.app.route(prefix + '/:query_id/endpoint')
        .get(_this.endpointController.getQueryById)
        .put(_this.endpointController.putQueryById)
        .delete(_this.endpointController.deleteQueryById);
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
        this.config.mongoUrl,
        this.config.objectStorageUrl
    ];
    return new Promise(function(resolve, reject) {
        //Create one Promise par DB to connect to
        var promises = [];
        for (var i = 0; i < urls_list.length; i++) {
            var p = new Promise(function(resolve, reject) {
                mongodb.connect(urls_list[i], function(err, db) {
                    if (err !== null)
                        reject(defines.errorFormat('Database connection failure: ' + err));
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
            _this.grid = new GridFSBucket(_this.objectDb, { bucketName: defines.queryGridFSCollectionName });
            resolve(true);
        }, function (error) {
            reject(defines.eerror);
        });
    });
};

module.exports = BorderlineMiddleware;