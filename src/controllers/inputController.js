const QueryFactory = require('../core/queryFactory.js');
const { ErrorHelper } = require('borderline-utils');

/**
 * @fn InputController
 * @desc Controller for queries inputs management.
 * @param queryCollection MongoDb collection where the queries are stored
 * @param storage Object storage instance to access/store queries data
 * @constructor
 */
function InputController(queryCollection, storage) {
    this.factory = new QueryFactory(queryCollection, storage);
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getQueryById = InputController.prototype.getQueryById.bind(this);
    this.putQueryById = InputController.prototype.putQueryById.bind(this);
    this.deleteQueryById = InputController.prototype.deleteQueryById.bind(this);
}

/**
 * @fn getQueryByID
 * @desc Controller method to retrieve a query input model
 * @param req Express.js request object
 * @param res Express.js response object
 */
InputController.prototype.getQueryById = function(req, res) {
    let query_id = req.params.query_id;
    if (query_id === null || query_id === undefined || query_id.length === 0) {
        res.status(401);
        res.json(ErrorHelper('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.getInput().then(function(result) {
            res.status(200);
            res.json(result);
        }, function(error) {
           res.status(401);
           res.json(ErrorHelper(error));
        });
    }, function(error) {
        res.status(401);
        res.json(ErrorHelper('Error retrieving query from ID', error));
    });
};


/**
 * @fn putQueryById
 * @desc Controller used to update query input. Expected format is STD
 * @param req Express.js request object
 * @param res Express.js response object
 */
InputController.prototype.putQueryById = function(req, res) {
    let query_id = req.params.query_id;
    let data = req.body;
    if (query_id === null || query_id === undefined || data === null || data === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.setInput(data).then(function(local_data) {
            res.status(200);
            res.json(local_data);
        }, function (error) {
            res.status(401);
            res.json(ErrorHelper('Updating input failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(ErrorHelper('Update query failed', error));
    });
};

/**
 * @fn deleteQueryById
 * @desc Removes input from target query by reset the field to nothing.
 * @param req Express.js request object
 * @param res Express.js response object
 */
InputController.prototype.deleteQueryById = function(req, res) {
    let query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing query ID'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.setInput({}).then(function(data_model) {
            res.status(200);
            res.json(data_model);
        }, function(error) {
          res.status(401);
          res.json(ErrorHelper('Reset input from model failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(ErrorHelper('Delete failed', error));
    });
};

module.exports = InputController;
