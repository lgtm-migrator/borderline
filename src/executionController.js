// Vendor modules
const ObjectID = require('mongodb').ObjectID;

// Project modules
const defines = require('./defines.js');
const QueryFactory = require('./query/queryFactory.js');
const ObjectStorage = require('./query/objectStorage.js');
const ts171 = require('./endpoints/ts171.js');

/**
 * @fn ExecutionController
 * @desc Manager for the execution related endpoints
 * @param queryCollection MongoDB collection queries storage
 * @param gridFs MongoDB GridFS storage collection used by some query results
 * @constructor
 */
function ExecutionController(queryCollection, gridFs) {
    this.queryCollection = queryCollection;
    this.grid = gridFs;
    this.queryFactory = new QueryFactory(queryCollection, gridFs);
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
    var noCache = req.body.hasOwnProperty('nocache') ? req.body['nocache'] : false;

    this.queryFactory.fromID(query_id).then(function(queryObject) {
        queryObject.execute(!noCache).then(function (result) {
            res.status(200);
            res.json(result);
        }, function (error) {
            res.status(401);
            res.json(error);
        });
    }, function (error) {
        res.status(401);
        res.json(error);
    })
};

ExecutionController.prototype.old_executeQuery = function(req, res) {
    var _this = this;
    if (req.body === null || req.body === undefined ||
        req.body.hasOwnProperty('query') === false) {
        res.status(401);
        res.json({error: 'Requested execution is missing parameters'});
        return;
    }
    var query_id = req.body['query'];
    var noCache = req.body.hasOwnProperty('nocache') ? req.body['nocache'] : false;

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
                queryModel = result;
                resolve(queryModel);
            }, function(error) {
                reject(error);
            })
        });
    };

    var cacheQueryFn = function(queryModel) {
        return new Promise(function(resolve, reject) {
            if (noCache === false) {
                _this._cacheQuery(queryModel).then(function(queryModel) {
                    resolve(queryModel);
                }, function(error) {
                    reject('Caching failed: ' + error);
                });
            } else {
                resolve(queryModel);
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
    }).then(function(queryModel) {
        res.status(200);
        if (queryModel.isGridFS) {
            var data = "";
            var ds = _this.grid.openDownloadStreamByName(queryModel.data);
            ds.on('data', function(chunk) { data += chunk });
            ds.on('end', function() { res.json(data); } );
        }
        else {
            res.json(queryModel.data);
        }
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

ExecutionController.prototype._cacheQuery = function(queryModel) {
    var _this = this;
    return  new Promise(function (resolve, reject) {
        if (queryModel.dataSize >= defines.thresholdGridFS) {
            var dataFile = queryModel['_id'].toString() + '.dat';
            var us = _this.grid.openUploadStream(dataFile);
            us.end(JSON.stringify(queryModel.data));
            queryModel.data = dataFile;
            queryModel.isGridFS = true;
        }
        else {
            queryModel.isGridFS = false;
        }
        _this.queryCollection.findOneAndReplace({_id: new ObjectID(queryModel['_id'])}, queryModel).then(function (result) {
            if (result.ok == 1) {
                resolve(queryModel);
            }
            else {
                reject(result.lastErrorObject);
            }
        }, function (error) {
            reject(error);
        });
    });
};

module.exports = ExecutionController;