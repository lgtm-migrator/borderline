const QueryFactory = require('./core/queryFactory.js');
var defines = require('./defines.js');

/**
 * @fn InputController
 * @desc Controller for queries inputs management.
 * @param queryCollection MongoDb collection where the queries are stored
 * @param queryGridFS ObjectStore to build the queries
 * @constructor
 */
function InputController(queryCollection, queryGridFS) {
    this.factory = new QueryFactory(queryCollection, queryGridFS);
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getNewQuery = InputController.prototype.getNewQuery.bind(this);
    this.postNewQuery = InputController.prototype.postNewQuery.bind(this);
    this.getQueryById = InputController.prototype.getQueryById.bind(this);
    this.putQueryById = InputController.prototype.putQueryById.bind(this);
    this.deleteQueryById = InputController.prototype.deleteQueryById.bind(this);
}


InputController.prototype.getNewQuery = function(req, res) {
    var newQuery = Object.assign({}, defines.queryModel);

    this.queryCollection.insertOne(newQuery).then(function(r) {
        if (r.insertedCount == 1) {
            res.status(200);
            res.json(r.ops[0]);
        }
        else {
            res.status(401);
            res.json({error: 'Insert a new query failed'});
        }
    }, function(error){
       res.status(501);
       res.json({ error: error });
    });
};

InputController.prototype.postNewQuery = function(req, res) {
    var credentials = req.body.credentials;
    var endpoint = req.body.endpoint;
    if (endpoint == null || credentials == null) {
        res.status(401);
        res.json(defines.errorStacker('Missing query data'));
        return;
    }
    var newQuery = Object.assign({}, defines.queryModel, { endpoint: endpoint }, {credentials: credentials});

    this.queryCollection.insertOne(newQuery).then(function(r) {
        if (r.insertedCount == 1) {
            res.status(200);
            res.json(r.ops[0]);
        }
        else {
            res.status(401);
            res.json(defines.errorStacker('Insert a new query failed'));
        }
    }, function(error){
        res.status(501);
        res.json(defines.errorStacker(error));
    });
};

/**
 * @fn getQueryByID
 * @desc Controller method to retrieve a query input model
 * @param req Express.js request object
 * @param res Express.js response object
 */
InputController.prototype.getQueryById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined || query_id.length == 0) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.getInput().then(function(result) {
            res.status(200);
            res.json(result);
        }, function(error) {
           res.status(401);
           res.json(defines.errorStacker(error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Error retrieving query from ID', error));
    });
};


/**
 * @fn putQueryById
 * @desc Controller used to update query input. Expected format is STD
 * @param req Express.js request object
 * @param res Express.js response object
 */
InputController.prototype.putQueryById = function(req, res) {
    var query_id = req.params.query_id;
    var data = req.body;
    if (query_id === null || query_id === undefined || data === null || data === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.setInputStd(data).then(function(local_data) {
            queryObject.pushModel().then(function() {
                res.status(200);
                res.json(local_data);
            }, function(error) {
                res.status(401);
                res.json(defines.errorStacker('Updating input model failed', error));
            });
        }, function (error) {
            res.status(401);
            res.json(defines.errorStacker('Updating input from std failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Updating query failed', error));
    });
};

/**
 * @fn deleteQueryById
 * @desc Removes input from target query.
 * Removes both std and local inputs and sets defaults from defines
 * @param req Express.js request object
 * @param res Express.js response object
 */
InputController.prototype.deleteQueryById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query ID'));
        return;
    }
    this.factory.fromID(query_id).then(function(queryObject) {
        queryObject.model.input = Object.assign({}, defines.queryModel.input);
        queryObject.pushModel().then(function() {
            res.status(200);
            res.json(queryObject.model.input);
        }, function(error) {
          res.status(401);
          res.json(defines.errorStacker('Delete from model failed', error));
        });
    }, function(error) {
        res.status(401);
        res.json(defines.errorStacker('Delete failed', error));
    });
};


module.exports = InputController;