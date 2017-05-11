// Vendor modules
const ObjectID = require('mongodb').ObjectID;

// Project modules
const Query_TS171 = require('./ts171/queryObject.js');
const defines = require('../defines.js');

/**
 * @fn QueryFactory
 * @desc Factory class for the different queries implementations
 * @param queryCollection MongoDb collection where all the queries are stored
 * @param queryGridFS MongoDB collection for the queries result data
 * @constructor
 */
function QueryFactory(queryCollection, queryGridFS) {
    this.queryCollection = queryCollection;
    this.queryGridFS = queryGridFS;
}

/**
 * @fn fromModel
 * @desc Construct implementation from its model
 * @param queryModel Plain JS object data model
 * @return {Promise} A Promise resolving to the allocated implementation Object
 */
QueryFactory.prototype.fromModel = function(queryModel) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        switch (queryModel.endpoint.sourceType) {
            case 'TS171':
                resolve(new Query_TS171(queryModel, _this.queryCollection, _this.queryGridFS));
            case 'eHS':
                reject(defines.errorStacker('eHS support is not implemented (yet ?)'));
            default:
                reject(defines.errorStacker('Type [' + queryModel.endpoint.sourceType + '] is unknown'));
        }
    });
};

/**
 * @fn fromID
 * @param query_id Unique identifier string used by MongoDB
 * @return {Promise} A Promise resolving to the allocated implementation Object
 */
QueryFactory.prototype.fromID = function(query_id) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            _this.queryCollection.findOne({_id: new ObjectID(query_id)}).then(function (queryModel) {
                _this.fromModel(queryModel).then(function (queryObj) {
                    resolve(queryObj);
                }, function (error) {
                    reject(defines.errorStacker(error));
                });
            }, function (error) {
                reject(defines.errorStacker(query_id + ' not found', error));
            });
        }
        catch (error) {
            reject(defines.errorStacker('From ID caught error', error));
        }
    });
};

module.exports = QueryFactory;