const defines = require('./defines.js');
const http = require('http');
const ObjectID = require('mongodb').ObjectID;

function ExecutionController(queryCollection, cacheCollection) {
    this.queryCollection = queryCollection;
    this.cacheCollection = cacheCollection;

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

ExecutionController.prototype._execute_TS171 = function(queryModel) {
    //Call TS 17.1 backend here
    return new Promise(function(resolve, reject) {
        resolve({/* Default empty object */});
    });
};

ExecutionController.prototype._executeFromQuery = function(queryModel) {
    var _this = this;
    console.log("Execute");
    console.log(queryModel);
    return new Promise(function (resolve, reject) {
        switch (queryModel.endpoint.sourceType) {
            case "TS171" :
                _this._execute_TS171(queryModel).then(function(result) {
                    resolve(result)
                }, function(error) {
                    reject(error)
                });
            default:
                reject('Source type ' + queryModel.endpoint.sourceType + ' is not supported');
        }
    });
};

ExecutionController.prototype._cacheQuery = function(query_id, query_data) {
    return  new Promise(function (resolve, reject) {
        var cacheEntry = Object.assign({}, defines.cacheModel, { query: query_id, data: query_data });
        this.cacheCollection.insertOne(cacheEntry).then(function(result) {
            if (result.insertedCount == 1) {
                resolve(result.op[0]);
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