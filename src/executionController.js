const defines = require('./defines.js');
const request = require('request');
const ObjectID = require('mongodb').ObjectID;

const ts171 = require('./endpoints/ts171.js');

function ExecutionController(queryCollection, cacheCollection) {
    this.queryCollection = queryCollection;
    this.cacheCollection = cacheCollection;

    this.ts171 = new ts171(this.queryCollection);

    //Bind member functions
    this.executeQuery = ExecutionController.prototype.executeQuery.bind(this);
}


ExecutionController.prototype.executeQuery = function(req, res) {
    var _this = this;
    if (req.body === null || req.body === undefined ||
        req.body.hasOwnProperty('query') === false) {
        res.status(401);
        res.json({error: 'Requested execution is missing parameters'});
        return;
    }
    var query_id = req.body['query'];
    var noCache = req.body.hasOwnProperty('nocache') ? false : req.body['nocache'];

    var findQueryFn = function () {
        return new Promise(function (resolve, reject) {
            _this.queryCollection.findOne({_id: new ObjectID(query_id)}).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    };

    var executeQueryFn = function(queryModel) {
        return new Promise(function(resolve, reject) {
            _this._executeFromQuery(queryModel).then(function (result) {
                resolve(result);
            }, function(error) {
                reject(error);
            })
        });
    };

    var cacheQueryFn = function(query_data) {
        return new Promise(function(resolve, reject) {
            if (noCache === false) {
                _this._cacheQuery(query_id, query_data).then(function(result) {
                    resolve(result);
                }, function(error) {
                    reject('Caching failed: ' + error);
                });
            } else {
                resolve.json({ query: query_id, data: query_data });
            }
        });
    };

    //Execute Promises chain
    findQueryFn().then(executeQueryFn, function(error) {
        res.status(401);
        res.json({error: error});
    }).then(cacheQueryFn, function(error) {
        res.status(401);
        res.json({error: error});
    }).then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({error: error});
    });
};

ExecutionController.prototype._executeFromQuery = function(queryModel) {
    var _this = this;

    return new Promise(function (resolve, reject) {
        //Pick the right handler
        var handler = null;
        switch (queryModel.endpoint.sourceType) {
            case 'TS171' :
                handler = _this.ts171.execute;
                break;
            default:
                handler = function(queryModel) {
                    return new Promise(function (_, default_reject) {
                        default_reject('Source type ' + queryModel.endpoint.sourceType + ' is not supported');
                    })
                };
        }

        //Execute this handler
        handler(queryModel).then(function(result) {
            resolve(result);
        }, function (error) {
            reject(error);
        });
    });
};

ExecutionController.prototype._cacheQuery = function(query_id, query_data) {
    var _this = this;
    return  new Promise(function (resolve, reject) {
        var cacheEntry = Object.assign({}, defines.cacheModel, { query: query_id, data: query_data });
        _this.cacheCollection.insertOne(cacheEntry).then(function(result) {
            if (result.insertedCount == 1) {
                resolve(result.ops[0]);
            }
            else {
                reject(result);
            }
        }, function (error) {
            reject(error);
        });
    });
};

module.exports = ExecutionController;