let defines = require('./defines.js');
const ObjectID = require('mongodb').ObjectID;

/**
 * @fn QueryController
 * @desc Controller for queries inputs management.
 * @param queryCollection MongoDb collection where the queries are stored
 * @param queryGridFS MongoDB grid fs collection where the data is stored
 * @constructor
 */
function QueryController(queryCollection) {
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getNewQuery = QueryController.prototype.getNewQuery.bind(this);
    this.postNewQuery = QueryController.prototype.postNewQuery.bind(this);
    this.postNewQueryTyped = QueryController.prototype.postNewQueryTyped.bind(this);
    this.deleteQueryById = QueryController.prototype.deleteQueryById.bind(this);
}

/**
 * @fn getNewQuery
 * @param req Express.js request object
 * @param res Express.js response object
 */
QueryController.prototype.getNewQuery = function(__unused__req, res) {
    let newQuery = Object.assign({},
        defines.queryModel,
        {
            endpoint: {
                sourceType: defines.endpointTypes[0] //Defaults to first support type
            }
        });

    this.queryCollection.insertOne(newQuery).then(function(r) {
        if (r.insertedCount === 1) {
            res.status(200);
            res.json(r.ops[0]);
        }
        else {
            res.status(401);
            res.json({error: 'Insert a new empty query failed'});
        }
    }, function(error){
       res.status(501);
       res.json({ error: error });
    });
};

/**
 * @fn postNewQuery
 * @param req Express.js request object
 * @param res Express.js response object
 */
QueryController.prototype.postNewQuery = function(req, res) {
    let credentials = req.body.credentials;
    let endpoint = req.body.endpoint;
    if (endpoint === null || endpoint === undefined ||
        credentials === null || credentials === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query data'));
        return;
    }
    if (defines.endpointTypes.find(function(v) { return v === endpoint.sourceType; }) === undefined) {
        res.status(401);
        res.json(defines.errorStacker('Invalid source type'));
        return;
    }
    let newQuery = Object.assign({}, defines.queryModel, { endpoint: endpoint }, {credentials: credentials});

    this.queryCollection.insertOne(newQuery).then(function(r) {
        if (r.insertedCount === 1) {
            res.status(200);
            res.json(r.ops[0]);
        }
        else {
            res.status(401);
            res.json(defines.errorStacker('Insert a new query failed'));
        }
    }, function(error){
        res.status(500);
        res.json(defines.errorStacker(error));
    });
};

/**
 * @fn postNewQueryTyped
 * @param req Express.js request object. Must contain query_type parameter
 * @param res Express.js response object
 */
QueryController.prototype.postNewQueryTyped = function(req, res) {
    let query_type = req.params.query_type;

    if (defines.endpointTypes.includes(query_type) === false) {
        res.status(400);
        res.json(defines.errorStacker('Unknown query type'));
    }

    let endpointModel = Object.assign({}, defines.endpointModel, { sourceType: query_type});
    //Create new query from here
    let newQuery = Object.assign({}, defines.queryModel, { endpoint: endpointModel } , req.body);
    this.queryCollection.insertOne(newQuery).then(function(r) {
        if (r.insertedCount === 1) {
            res.status(200);
            res.json(r.ops[0]);
        }
        else {
            res.status(401);
            res.json(defines.errorStacker('Insert a new query failed'));
        }
    }, function(error){
        res.status(500);
        res.json(defines.errorStacker(error));
    });
};

QueryController.prototype.deleteQueryById = function(req, res) {
    let query_id = req.params.query_id;
    if (query_id === undefined || query_id === null) {
        res.statusCode(404);
        res.json(defines.errorStacker('Missing query_id'));
    }
    this.queryCollection.findOneAndDelete({ _id : new ObjectID(query_id)}).then(function(__ok_delete) {
        res.status(200);
        res.json({success: true});
    }, function(error) {
        res.status(500);
        res.json(defines.errorStacker('Failed to delete query', error));
    });
};


module.exports = QueryController;
