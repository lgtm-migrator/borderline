const express = require('express');
const mongodb = require('mongodb').MongoClient;
const body_parser = require('body-parser');

function BorderlineMiddleware(config) {
    this.config = config;
    this.app = express();

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
    mongodb.connect(this.config.mongoUrl, function (err, db) {
        //MongoDB connection failed
        if (err !== null) {
            _this.app.all('*', function(req, res) {
               res.status(501);
               res.json({ error: 'Database connection failure: ' + err});
            });
            return;
        }

        //Store DB connection
        _this.db = db;
        //Import & instantiate controller modules
        var queryControllerModule = require('./queryController.js');
        _this.queryController = new queryControllerModule(_this.db.collection('queries'));

        //Setup controllers endpoints
        _this.app.route('/query/new')
            .get(_this.queryController.getNewQuery)
            .post(_this.queryController.postNewQuery);
        _this.app.route('/query/{query_id}')
            .get(_this.queryController.getQueryById)
            .put(_this.queryController.putQueryById)
            .delete(_this.queryController.deleteQueryById);
        _this.app.route('/execute')
            .get(_this.queryController.executeQuery);
    });

    return this.app;
}

BorderlineMiddleware.prototype.dummy = function() {
  console.log("Dummy function");
};

module.exports = BorderlineMiddleware;