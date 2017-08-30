// Local modules
const defines = require('../defines.js');
const QueryAbstract = require('./queryAbstract.js');

/**
 * @fn QueryFile
 * @desc Query Implementation for File uploads
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param storage Object storage instance to read/write query result
 * @constructor
 */
function QueryFile(queryModel, queryCollection, storage) {
    QueryAbstract.call(this, queryModel, queryCollection, storage);
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
 * @param req Express.js request object, must contain .file attribute
 * @return {Promise} Execution status object on success
 */
QueryFile.prototype.execute = function(req) {
    let _this = this;

    return new Promise(function(resolve, reject) {
        if (req.file === undefined || req.file === null) {
            _this.registerExecutionError(defines.errorStacker('No files uploaded'));
            reject(defines.errorStacker('Missing file to upload'));
            return;
        }
        //Start file upload in background, update execution status
        _this.registerExecutionStart().then(function (status) {
            resolve(status);
        }, function (error) {
            reject(defines.errorStacker('Execution fail', error));
        });

        _this._receiveFile(req.file).then(function() {
            _this.registerExecutionEnd(); //Update status to done
        }, function (error) {
            _this.registerExecutionError(defines.errorStacker('File upload execute failed', error));
        });
    });
};

/**
 * @fn _receiveFile
 * @param file Uploaded multer file object
 * @private
 * @return {Promise} Resolves to the file id in storage on success, rejects with error stack
 */
QueryFile.prototype._receiveFile = function(file) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        let op = null;
        if (_this.model.output === undefined ||
            _this.model.output.std === undefined ||
            _this.model.output.std.dataId === undefined ||
            _this.model.output.std.dataId === null) { // First time write of the file
            op = _this.storage.createObject(file.buffer);
        }
        else {
            op = _this.storage.setObject(_this.model.output.std.dataId, file.buffer);
        }
        op.then(function(file_id) {
            //Update output dataId on success
            _this.model.output = Object.assign({}, _this.model.output, { std: { dataId: file_id, filename: file.originalname}});
            resolve(file_id);
        }, function(error) {
            reject(defines.errorStacker('File ', error));
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
QueryFile.prototype.input_standard2local = function(__unused__data) {
    return 'null';
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
QueryFile.prototype.output_standard2local = function(__unused__data) {
    return 'null';
};


module.exports = QueryFile;
