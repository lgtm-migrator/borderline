const QueryFactory = require('../core/queryFactory.js');
const defines = require('../defines.js');
const { ErrorHelper, Models } = require('@borderline/utils');

/**
 * @fn EndpointController
 * @desc Controller for queries data sources management.
 * @param queryCollection MongoDb collection where the queries are stored
 * @param storage Object storage instance to access/store queries data
 * @constructor
 */
function EndpointController(queryCollection, storage) {
    this.factory = new QueryFactory(queryCollection, storage);
    this.queryCollection = queryCollection;

    //Bind member functions to this instance
    this.getQueryById = EndpointController.prototype.getQueryById.bind(this);
    this.putQueryById = EndpointController.prototype.putQueryById.bind(this);
    this.deleteQueryById = EndpointController.prototype.deleteQueryById.bind(this);
}

/**
 * @fn getQueryByID
 * @desc Controller method to retrieve a query data source
 * @param req Express.js request object
 * @param res Express.js response object
 */
EndpointController.prototype.getQueryById = function (req, res) {
    let query_id = req.params.query_id;
    if (query_id === null || query_id === undefined || query_id.length === 0) {
        res.status(401);
        res.json(ErrorHelper('Missing query_id'));
        return;
    }
    this.factory.fromID(query_id).then(function (queryObject) {
        res.status(200);
        res.json(queryObject.getModel().endpoint);
    }, function (error) {
        res.status(401);
        res.json(ErrorHelper('Error retrieving query from ID', error));
    });
};


/**
 * @fn putQueryById
 * @desc Controller used to update query data source
 * @param req Express.js request object
 * @param res Express.js response object
 */
EndpointController.prototype.putQueryById = function (req, res) {
    let query_id = req.params.query_id;
    let data = req.body;
    if (query_id === null || query_id === undefined || data === null || data === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing query_id'));
        return;
    }
    if (data.hasOwnProperty('type') === false || defines.endpointTypes.find(
        function (val) {
            return val === data.type;
        }) === undefined) {
        res.status(401);
        res.json(ErrorHelper('Invalid type'));
        return;
    }
    this.factory.fromID(query_id).then(function (queryObject) {
        queryObject.setModel({ endpoint: Object.assign({}, Models.BL_MODEL_DATA_SOURCE, data) });
        queryObject._pushModel().then(function () {
            res.status(200);
            res.json(data);
        }, function (error) {
            res.status(501);
            res.json(ErrorHelper('Updating endpoint failed', error));
        });
    }, function (error) {
        res.status(501);
        res.json(ErrorHelper('Updating query failed', error));
    });
};

/**
 * @fn deleteQueryById
 * @desc Removes data source from target query.
 * @param req Express.js request object
 * @param res Express.js response object
 */
EndpointController.prototype.deleteQueryById = function (req, res) {
    let query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json(ErrorHelper('Missing query ID'));
        return;
    }
    this.factory.fromID(query_id).then(function (queryObject) {
        let type = queryObject.getModel().endpoint.type;
        queryObject.setModel({ endpoint: Object.assign({}, Models.BL_MODEL_DATA_SOURCE, { type: type }) });
        queryObject._pushModel().then(function () {
            res.status(200);
            res.json(queryObject.getModel().endpoint);
        }, function (error) {
            res.status(401);
            res.json(ErrorHelper('Delete endpoint from model failed', error));
        });
    }, function (error) {
        res.status(401);
        res.json(ErrorHelper('Delete failed', error));
    });
};


module.exports = EndpointController;
