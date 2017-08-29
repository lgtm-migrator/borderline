const QueryFactory = require('./core/queryFactory.js');
var defines = require('./defines.js');

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
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.getOutputStd().then(function(result) {
            res.status(200);
            res.json(result);
        }, function(error) {
            res.status(401);
            res.json(defines.errorStacker('Output std extract failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Error retrieving query from ID', error));
    });
};


/**
 * @fn putQueryById
 * @desc Controller used to update query output.
 * @param req Express.js request object
 * @param res Express.js response object
 */
OutputController.prototype.putQueryById = function(req, res) {
    var query_id = req.params.query_id;
    var data = req.body;
    if (query_id === null || query_id === undefined || data === null || data === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.setOutputStd(JSON.stringify(data)).then(function(local_data) {
            res.status(200);
            res.json(local_data);
        }, function(error) {
            res.status(401);
            res.json(defines.errorStacker('Updating output failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Updating query failed', error));
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
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query ID'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.model.output = Object.assign({}, defines.queryModel.output);
        queryObject.pushModel().then(function() {
            res.status(200);
            res.json(queryObject.model.output);
        }, function(error) {
            res.status(401);
            res.json(defines.errorStacker('Delete from model failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Delete failed', error));
    });
};


module.exports = OutputController;
