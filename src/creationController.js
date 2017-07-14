var defines = require('./defines.js');

/**
 * @fn CreationController
 * @desc Controller for queries inputs management.
 * @param queryCollection MongoDb collection where the queries are stored
 * @param queryGridFS MongoDB grid fs collection where the data is stored
 * @constructor
 */
function CreationController(queryCollection) {
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getNewQuery = CreationController.prototype.getNewQuery.bind(this);
    this.postNewQuery = CreationController.prototype.postNewQuery.bind(this);
    this.postNewQueryTyped = CreationController.prototype.postNewQueryTyped.bind(this);
}

/**
 * @fn getNewQuery
 * @param req Express.js request object
 * @param res Express.js response object
 */
CreationController.prototype.getNewQuery = function(req, res) {
    var newQuery = Object.assign({},
        defines.queryModel,
        {
            endpoint: {
                sourceType: defines.endpointTypes[0] //Defaults to first support type
            }
        });

    this.queryCollection.insertOne(newQuery).then(function(r) {
        if (r.insertedCount == 1) {
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
CreationController.prototype.postNewQuery = function(req, res) {
    var credentials = req.body.credentials;
    var endpoint = req.body.endpoint;
    if (endpoint == null || endpoint == undefined ||
        credentials == null || credentials == undefined) {
        res.status(401);
        res.json(defines.errorStacker('Missing query data'));
        return;
    }
    if (defines.endpointTypes.find(function(v) { return v === endpoint.sourceType; }) == undefined) {
        res.status(401);
        res.json(defines.errorStacker('Invalid source type'));
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
        res.status(500);
        res.json(defines.errorStacker(error));
    });
};

/**
 * @fn postNewQueryTyped
 * @param req Express.js request object. Must contain query_type parameter
 * @param res Express.js response object
 */
CreationController.prototype.postNewQueryTyped = function(req, res) {
    var query_type = req.params.query_type;

    if (defines.endpointTypes.includes(query_type) == false) {
        res.status(400);
        res.json(defines.errorStacker('Unknown query type'));
    }

    var endpointModel = Object.assign({}, defines.endpointModel, { sourceType: query_type});
    //Create new query from here
    var newQuery = Object.assign({}, defines.queryModel, { endpoint: endpointModel } , req.body);
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
        res.status(500);
        res.json(defines.errorStacker(error));
    });
};

module.exports = CreationController;
