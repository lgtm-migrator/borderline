const { ErrorHelper, Models } = require('@borderline/utils');

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

    // Bind Abstract interface implementation
    this.initialize = QueryFile.prototype.initialize.bind(this);
    this.execute = QueryFile.prototype.execute.bind(this);
    this.terminate = QueryFile.prototype.terminate.bind(this);
    this.interrupt = QueryFile.prototype.interrupt.bind(this);
    this.getInput = QueryFile.prototype.getInput.bind(this);
    this.setInput = QueryFile.prototype.setInput.bind(this);
    this.getOutput = QueryFile.prototype.getOutput.bind(this);
    this.setOutput = QueryFile.prototype.setOutput.bind(this);

    // Bind private member functions
    this._receiveFile = QueryFile.prototype._receiveFile.bind(this);

}
QueryFile.prototype = Object.create(QueryAbstract.prototype); //Inherit Js style
QueryFile.prototype.constructor = QueryFile;

/**
 * @fn initialize
 * @desc Prepares the execution of this query
 * @param request The Express.js HTTP request that triggered the execution
 * @return Promise
*/
QueryAbstract.prototype.initialize = function (request) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (request !== null && request !== undefined) {
            if (request.hasOwnProperty('file')) {
                _this._receiveFile(request.file).then(function () {
                    resolve(true);
                }, function (file_error) {
                    reject(ErrorHelper('File upload error', file_error));
                });
            }
            else {
                reject(ErrorHelper('Missing file in the multipart form data'));
            }
        }
        else {
            reject(ErrorHelper('File query needs the multipart request'));
        }
    });
};

/**
 * @fn execute
 * @desc Execution implementation of the Abstract for file upload.
 * Does nothing because the file upload happen during initialize
 * @return {Promise.<boolean>} Always true
 */
QueryFile.prototype.execute = function () {
    return Promise.resolve(true);
};

/**
 * @fn terminate
 * @desc Implementation of the execution teardown. Does nothing because the file is already stored.
 * @return {Promise.<boolean>} Always true
 */
QueryFile.prototype.terminate = function () {
    return Promise.resolve(true);
};

/**
 * @fn interrupt
 * @desc Storage class doesnt provide a cancel interface.
 * So query file upload cannot be interrupted.
 * @return {Promise.<ErrorHelper>} Always rejects an error
 */
QueryFile.prototype.interrupt = function () {
    return Promise.reject(ErrorHelper('Cannot interrupt file uploads'));
};

/**
 * @fn getInput
 * @desc Setter on file upload query input
 * @warning Always reject because file upload queries never use the input
 * @return {Promise.reject}
 */
QueryFile.prototype.getInput = function () {
    return new Promise.reject(ErrorHelper('File queries have no inputs!'));
};

/**
 * @fn setInput
 * @desc Getter on this query input.
 * @warning Always reject because file upload query doesnt need input
 * @return {Promise.reject}
 */
QueryFile.prototype.setInput = function () {
    return new Promise.reject(ErrorHelper('File queries have no input. Files are stored in the output'));
};

/**
 * @fn getOutput
 * @desc Getter on this query output: content of the file uploaded alongside the execute request.
 * @return {Promise} Resolve to the content of the file from the cache, or rejects an error
 */
QueryFile.prototype.getOutput = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this._model.output && _this._model.output.length === 1) {
            let output_model = _this._model.output[0]; // Only one output for File upload queries
            if (output_model.cache && output_model.cache.dataSize && output_model.cache.storageId) {
                _this._storage.getObject(output_model.cache.storageId).then(function (data) {
                    resolve(data); // Returns the data as cached
                }, function (storage_error) {
                    reject(ErrorHelper('Getting output from storage failed', storage_error));
                });
            }
            else {
                reject(ErrorHelper('Query File upload doesnt have cached output'));
            }
        }
        else {
            reject(ErrorHelper('Query File Upload doesnt have output'));
        }
    });
};

/**
 * @fn setOutput
 * @desc Update this query Output data by storing the data in the cache, and updating the model
 * @param data Raw data to store
 * @return {Promise} Resolve to the data model on success or reject an error
 */
QueryFile.prototype.setOutput = function (data) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this._storage.createObject(data).then(function (storage_id) {
            // Update model to remember where we stored the data
            let data_model = Object.assign({}, Models.BL_MODEL_DATA,
                {
                    cache: {
                        dataSize: data.length,
                        storageId: storage_id
                    }
                });
            _this.setOutputModel(data_model); // Overrides previous cache
            _this._pushModel().then(function () {
                resolve(data_model);
            }, function (push_error) {
                reject(ErrorHelper('Saving output query model failed', push_error));
            });
        }, function (storage_error) {
            reject(ErrorHelper('Caching output in storage failed', storage_error));
        });
    });
};

/**
 * @fn _receiveFile
 * @param file Uploaded multer file object
 * @private
 * @return {Promise} Resolves to the file id in storage on success, rejects with error stack
 */
QueryFile.prototype._receiveFile = function (file) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this.setOutput(file.buffer).then(function (__unused__data_model) {
            resolve(true);
        }, function (output_error) {
            reject(ErrorHelper('Upload file failed', output_error));
        });
    });
};


module.exports = QueryFile;
