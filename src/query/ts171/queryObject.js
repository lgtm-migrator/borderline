const QueryAbstract = require('../queryAbstract.js');

/**
 * @fn QueryTransmart17_1
 * @desc Query Implementation for TranSMART 17.1
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param queryGridFS MongoDB gridFS object to read/write query result
 * @constructor
 */
function QueryTransmart17_1(queryModel, queryCollection, queryGridFS) {
    QueryAbstract.call(this, queryModel, queryCollection, queryGridFS);
}
QueryTransmart17_1.prototype = Object.create(QueryAbstract.prototype); //Inherit Js style
QueryTransmart17_1.prototype.constructor = QueryTransmart17_1;

/**
 * @fn input_local2standard
 * @todo Real implementation
 * @param data A TranSMART 17.1 query object to transform into standard query
 * @return Transformed to standard JS object
 */
QueryTransmart17_1.prototype.input_local2standard = function(data) {
    if (typeof(data) === 'object')
        return data;
    return JSON.parse(data);
};

/**
 * @fn input_standard2local
 * @todo Real implementation
 * @param data A Standard query input to transform to TranSMART 17.1 query object
 * @return Transformed to TS 17.1 object
 */
QueryTransmart17_1.prototype.input_standard2local = function(data) {
    return JSON.stringify(data);
};

/**
 * @fn output_local2standard
 * @todo Real implementation
 * @param data A TranSMART 17.1 query object to transform
 * @return Output data in standard format
 */
QueryTransmart17_1.prototype.output_local2standard = function(data) {
    return JSON.parse(data);
};

/**
 * @fn output_standard2local
 * @todo Real Implementation
 * @param data A Standard output object to transform
 * @return Object transformed to local format
 */
QueryTransmart17_1.prototype.output_standard2local = function(data) {
    return JSON.stringify(data);
};


module.exports = QueryTransmart17_1;