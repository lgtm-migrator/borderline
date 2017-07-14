// Vendor modules
const request = require('request');

// Local modules
const defines = require('../defines.js');
const QueryAbstract = require('./queryAbstract.js');

/**
 * @fn QueryFile
 * @desc Query Implementation for File uploads
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param queryGridFS MongoDB gridFS object to read/write query result
 * @constructor
 */
function QueryFile(queryModel, queryCollection, queryGridFS) {
    QueryAbstract.call(this, queryModel, queryCollection, queryGridFS);
}
QueryFile.prototype = Object.create(QueryAbstract.prototype); //Inherit Js style
QueryFile.prototype.constructor = QueryFile;

/**
 * @fn isAuth
 * @desc Always returns true because QueryFile has no need for credentials
 * @return {boolean} True
 */
QueryFile.prototype.isAuth = function() {
    return true;
};

/**
 * @fn execute
 * @desc Performs file storage
 * @return {Promise} Execution status object on success
 */
QueryFile.prototype.execute = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {

        _this.registerExecutionStart().then(function (status) {
            resolve(status);
        }, function (error) {
            reject(defines.errorStacker('Execution fail', error));
        });

        //Download file and stores it in output storage
        _this._receiveFile().then(function (file_data) {
                _this.setOutputStd(file_data).then(function (_) {
                    _this.registerExecutionEnd(); //Update status to done
                }, function (error) {
                    _this.registerExecutionError(defines.errorStacker('Execution failed while storing file', error));
                });
            },
            function (error) {
                _this.registerExecutionError(defines.errorStacker('File upload execute failed', error));
            });
    });
};

/**
 * @fn input_local2standard
 * @param data local data to transform
 * @return Transformed to standard JS object
 */
QueryFile.prototype.input_local2standard = function(data) {
    return data;
};

/**
 * @fn input_standard2local
 * @param data Standard data to transform
 * @return Null data pointer, File do not use local data format
 */
QueryFile.prototype.input_standard2local = function(data) {
    return null;
};

/**
 * @fn output_local2standard
 * @param data A Local query object to transform
 * @return Output data in standard format
 */
QueryFile.prototype.output_local2standard = function(data) {
    return data;
};

/**
 * @fn output_standard2local
 * @param data A Standard output object to transform
 * @return Null data pointer, File do not use Local data format
 */
QueryFile.prototype.output_standard2local = function(data) {
    return null;
};


module.exports = QueryFile;
