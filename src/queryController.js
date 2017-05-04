var defines = require('./defines.js');
const ObjectID = require('mongodb').ObjectID;

function QueryController(queryCollection) {
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getNewQuery = QueryController.prototype.getNewQuery.bind(this);
    this.postNewQuery = QueryController.prototype.postNewQuery.bind(this);
    this.getQueryById = QueryController.prototype.getQueryById.bind(this);
    this.putQueryById = QueryController.prototype.putQueryById.bind(this);
    this.deleteQueryById = QueryController.prototype.deleteQueryById.bind(this);
}


QueryController.prototype.getNewQuery = function(req, res) {
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

QueryController.prototype.postNewQuery = function(req, res) {
    var credentials = req.body.credentials;
    var endpoint = req.body.endpoint;
    if (endpoint == null || credentials == null) {
        res.status(401);
        res.json({error: 'Missing query data'});
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
            res.json({error: 'Insert a new query failed'});
        }
    }, function(error){
        res.status(501);
        res.json({ error: error });
    });
};

QueryController.prototype.getQueryById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json({error: 'Missing query_id'});
        return;
    }
    this.queryCollection.findOne({ _id: new ObjectID(query_id) }).then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Error retrieving query from ID: ' + error});
    });
};

QueryController.prototype.putQueryById = function(req, res) {
    var query_id = req.params.query_id;
    var data = req.body;
    if (query_id === null || query_id === undefined || data === null || data === undefined) {
        res.status(401);
        res.json({error: 'Missing query_id'});
        return;
    }
    this.queryCollection.findOneAndReplace({ _id: new ObjectID(query_id)}, data, { returnOriginal: false }).then(function(result) {
        if (result.ok == 1) {
            res.status(200);
            res.json(result.value);
        }
        else {
            res.status(501);
            res.json(result);
        }
    }, function(error) {
        res.status(401);
        res.json({error: 'Updating query failed: ' + error});
    });
};

QueryController.prototype.deleteQueryById = function(req, res) {
    var query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json({error: 'Missing query ID'});
        return;
    }
    this.queryCollection.findOneAndDelete({_id: new ObjectID(query_id) }).then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({error: 'Delete failed: ' + error});
    });

};


module.exports = QueryController;