// Vendor modules
const ObjectID = require('mongodb').ObjectID;

// Project modules
const Query_TS171 = require('./ts171/queryObject.js');

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
                reject('eHS support is not implemented (yet ?)');
            default:
                reject('Source type ' + queryModel.endpoint.sourceType + ' is not supported');
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
        _this.queryCollection.findOne({_id: new ObjectID(query_id)}).then(function(queryModel) {
            _this.fromModel(queryModel).then(function(queryObj) {
                resolve(queryObj);
            }, function (error) {
                reject({error: error});
            });
        }, function(error) {
           reject({error: error});
        });
    });
};

module.exports = QueryFactory;