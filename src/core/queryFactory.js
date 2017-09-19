const ObjectID = require('mongodb').ObjectID;
const { ErrorHelper, Constants } = require('borderline-utils');

const Query_TS171 = require('./queryObject_TS171.js');
const Query_File = require('./queryObject_File.js');

/**
 * @fn QueryFactory
 * @desc Factory class for the different queries implementations
 * @param queryCollection MongoDb collection where all the queries are stored
 * @param storage Object storage instance to store queries result data
 * @constructor
 */
function QueryFactory(queryCollection, storage) {
    this.queryCollection = queryCollection;
    this.storage = storage;
}

/**
 * @fn fromModel
 * @desc Construct implementation from its model
 * @param queryModel Plain JS object data model
 * @return {Promise} A Promise resolving to the allocated implementation Object
 */
QueryFactory.prototype.fromModel = function (queryModel) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        // Todo: Use a configuration file to make it dynamic
        switch (queryModel.endpoint.type) {
            case Constants.BL_QUERY_TYPE_TS171:
                resolve(new Query_TS171(queryModel, _this.queryCollection, _this.storage));
                break;
            case Constants.BL_QUERY_TYPE_FILE:
                resolve(new Query_File(queryModel, _this.queryCollection, _this.storage));
                break;
            case Constants.BL_QUERY_TYPE_EAE:
                reject(ErrorHelper('eAE support is not implemented, yet!!!'));
                break;
            default:
                reject(ErrorHelper('Type [' + queryModel.endpoint.type + '] is unknown'));
        }
    });
};

/**
 * @fn fromID
 * @param query_id Unique identifier string used by MongoDB
 * @return {Promise} A Promise resolving to the allocated implementation Object
 */
QueryFactory.prototype.fromID = function (query_id) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        try {
            _this.queryCollection.findOne({ _id: new ObjectID(query_id) }).then(function (queryModel) {
                if (queryModel === null || queryModel === undefined) {
                    reject(ErrorHelper('Unknown id ' + query_id));
                    return;
                }
                _this.fromModel(queryModel).then(function (queryObj) {
                    resolve(queryObj);
                }, function (error) {
                    reject(ErrorHelper(error));
                });
            }, function (error) {
                reject(ErrorHelper(query_id + ' not found', error));
            });
        }
        catch (error) {
            reject(ErrorHelper('From ID caught error', error));
        }
    });
};

module.exports = QueryFactory;
