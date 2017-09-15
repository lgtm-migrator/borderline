const QueryFactory = require('../core/queryFactory.js');
const { ErrorHelper } = require('borderline-utils');

/**
 * @fn OutputController
 * @desc Controller for queries results management.
 * @param queryCollection MongoDb collection where the queries are stored
 * @param storage Object storage instance to access/store queries data
 * @constructor
 */
function OutputController(queryCollection, storage) {
    this.factory = new QueryFactory(queryCollection, storage);
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getQueryById = OutputController.prototype.getQueryById.bind(this);
    this.putQueryById = OutputController.prototype.putQueryById.bind(this);
    this.deleteQueryById = OutputController.prototype.deleteQueryById.bind(this);
}

/**
 * @fn getQueryByID
 * @desc Controller method to retrieve a query output
 * @param req Express.js request object
 * @param res Express.js response object
 */
OutputController.prototype.getQueryById = function(req, res) {
    let query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.getOutput().then(function(result) {
            res.status(200);
            res.json(result);
        }, function(error) {
            res.status(401);
            res.json(ErrorHelper('Output extraction failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(ErrorHelper('Error retrieving query from ID', error));
    });
};


/**
 * @fn putQueryById
 * @desc Controller used to update query output.
 * @param req Express.js request object
 * @param res Express.js response object
 */
OutputController.prototype.putQueryById = function(req, res) {
    let query_id = req.params.query_id;
    let data = req.body;
    if (query_id === null || query_id === undefined || data === null || data === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.setOutput(data).then(function(data_model) {
            res.status(200);
            res.json(data_model);
        }, function(error) {
            res.status(401);
            res.json(ErrorHelper('Updating output failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(ErrorHelper('Updating query failed', error));
    });
};

/**
 * @fn deleteQueryById
 * @desc Removes output from target query.
 * Removes both std and local output and sets defaults from defines
 * @param req Express.js request object
 * @param res Express.js response object
 */
OutputController.prototype.deleteQueryById = function(req, res) {
    let query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing query ID'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        // Todo: Should erase of the old storage object if any
        queryObject.setOutput({}).then(function(data_model) {
            res.status(200);
            res.json(data_model);
        }, function(error) {
            res.status(401);
            res.json(ErrorHelper('Updating output failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(ErrorHelper('Delete failed', error));
    });
};


module.exports = OutputController;
