// Vendor modules
const ObjectID = require('mongodb').ObjectID;

// Project modules
const defines = require('./defines.js');
const QueryFactory = require('./core/queryFactory.js');

/**
 * @fn ExecutionController
 * @desc Manager for the execution related endpoints
 * @param queryCollection MongoDB collection queries storage
 * @param gridFs MongoDB GridFS storage collection used by some query results
 * @constructor
 */
function ExecutionController(queryCollection, gridFs) {
    this.queryCollection = queryCollection;
    this.grid = gridFs;
    this.queryFactory = new QueryFactory(queryCollection, gridFs);

    //Bind member functions
    this.executeQuery = ExecutionController.prototype.executeQuery.bind(this);
    this.getQueryById = ExecutionController.prototype.getQueryById.bind(this);
}

/**
 * @fn executeQuery
 * @desc Executes the query identified by the query_id
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExecutionController.prototype.executeQuery = function(req, res) {
    if (req.body === null || req.body === undefined ||
        req.body.hasOwnProperty('query') === false) {
        res.status(401);
        res.json({error: 'Requested execution is missing parameters'});
        return;
    }
    var query_id = req.body.query;

    this.queryFactory.fromID(query_id).then(function(queryObject) {
        queryObject.execute().then(function(result) {
            res.status(200);
            res.json(result);
        }, function (error) {
            res.status(401);
            res.json(defines.errorStacker(error));
        });
    }, function (error) {
        res.status(401);
        res.json(defines.errorStacker(error));
    });
};

/**
 * @fn getQueryById
 * @desc Retreive the current execution status for a specific query
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExecutionController.prototype.getQueryById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === undefined || query_id === null) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.queryFactory.fromID(query_id).then(function(queryObject) {
        res.status(200);
        res.json(queryObject.model.status);
    }, function (error) {
       res.status(401);
       res.json(defines.errorStacker('Get query execution status failed', error));
    });
};

module.exports = ExecutionController;
