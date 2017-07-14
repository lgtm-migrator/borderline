const QueryFactory = require('./core/queryFactory.js');
var defines = require('./defines.js');

/**
 * @fn CredentialsController
 * @desc Controller for queries credentials management.
 * @param queryCollection MongoDb collection where the queries are stored
 * @param queryGridFS ObjectStore to build the queries
 * @constructor
 */
function CredentialsController(queryCollection, queryGridFS) {
    this.factory = new QueryFactory(queryCollection, queryGridFS);
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getQueryById = CredentialsController.prototype.getQueryById.bind(this);
    this.putQueryById = CredentialsController.prototype.putQueryById.bind(this);
    this.deleteQueryById = CredentialsController.prototype.deleteQueryById.bind(this);
    this.getQueryAuthById = CredentialsController.prototype.getQueryAuthById.bind(this);
}

/**
 * @fn getQueryByID
 * @desc Controller method to retrieve a query credentials
 * @param req Express.js request object
 * @param res Express.js response object
 */
CredentialsController.prototype.getQueryById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined || query_id.length == 0) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        res.status(200);
        res.json(queryObject.model.credentials);
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Error retrieving query from ID', error));
    });
};


/**
 * @fn putQueryById
 * @desc Controller used to update query credentials
 * @param req Express.js request object
 * @param res Express.js response object
 */
CredentialsController.prototype.putQueryById = function(req, res) {
    var query_id = req.params.query_id;
    var data = req.body;
    if (query_id === null || query_id === undefined || data === null || data === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.model.credentials = Object.assign({}, defines.credentialsModel, data);
        queryObject.pushModel().then(function() {
            res.status(200);
            res.json(queryObject.model.credentials);
        }, function(error) {
            res.status(401);
            res.json(defines.errorStacker('Updating input model failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Updating query failed', error));
    });
};

/**
 * @fn deleteQueryById
 * @desc Removes credentials from target query. Reset to defaults
 * @param req Express.js request object
 * @param res Express.js response object
 */
CredentialsController.prototype.deleteQueryById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query ID'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.model.credentials = Object.assign({}, defines.credentialsModel);
        queryObject.pushModel().then(function() {
            res.status(200);
            res.json(queryObject.model.credentials);
        }, function(error) {
          res.status(401);
          res.json(defines.errorStacker('Delete from model failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Delete failed', error));
    });
};

/**
 * @fn getQueryAuthByID
 * @desc Controller method to determine if the credentials are still valid
 * @param req Express.js request object
 * @param res Express.js response object
 */
CredentialsController.prototype.getQueryAuthById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined || query_id.length == 0) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        if (queryObject.isAuth() == true) {
            res.status(200);
            res.json({isAuth: true});
        }
        else {
            res.status(200);
            res.json({isAuth: false});
        }
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Error retrieving query from ID', error));
    });
};

module.exports = CredentialsController;
