// Vendor modules
const ObjectID = require('mongodb').ObjectID;

// Local modules
const defines = require('../defines.js');

/**
 * @fn QueryAbstract
 * @desc Implementation independent query representation. MUST be inherited by the specific implementations
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param storage Object storage instance to read/write query result
 * @constructor
 */
function QueryAbstract(queryModel, queryCollection, storage) {
    this.model = queryModel;
    this.queryCollection = queryCollection;
    this.storage = storage;

    //Bind member functions
    this.pushModel = QueryAbstract.prototype.pushModel.bind(this);
    this.fetchModel = QueryAbstract.prototype.fetchModel.bind(this);
    this.setInputLocal = QueryAbstract.prototype.setInputLocal.bind(this);
    this.setInputStd = QueryAbstract.prototype.setInputStd.bind(this);
    this.setOutputLocal = QueryAbstract.prototype.setOutputLocal.bind(this);
    this.setOutputStd = QueryAbstract.prototype.setOutputStd.bind(this);
    this.registerExecutionStart = QueryAbstract.prototype.registerExecutionStart.bind(this);
    this.registerExecutionEnd = QueryAbstract.prototype.registerExecutionEnd.bind(this);
    this.registerExecutionError = QueryAbstract.prototype.registerExecutionError.bind(this);
}

/**
 * @fn isAuth
 * @desc Returns true if this query has a non-expired token
 * @pure
 */
QueryAbstract.prototype.isAuth = function() {
    throw 'isAuth must be overloaded in implementation';
};

/**
 * @fn execute
 * @desc Performs the query on the underlying data source
 * @param req Express.js request object. Some implementation requires params and or headers
 * @pure
 */
QueryAbstract.prototype.execute = function(__unused__req) {
    throw 'Execute should be overloaded by implementations';
};

/**
 * @fn input_local2standard
 * @pure
 */
QueryAbstract.prototype.input_local2standard = function(__unused__data) {
    throw 'Input local to standard should be overloaded';
};
/**
 * @fn input_standard2local
 * @pure
 */
QueryAbstract.prototype.input_standard2local = function(__unused__data) {
    throw 'Input standard to local should be overloaded';
};
/**
 * @fn output_local2standard
 * @pure
 */
QueryAbstract.prototype.output_local2standard = function(__unused__data) {
    throw 'Output local to standard should be overloaded';
};
/**
 * @fn output_standard2local
 * @pure
 */
QueryAbstract.prototype.output_standard2local = function(__unused__data) {
    throw 'Output standard to local should be overloaded';
};

/**
 * @fn getInput
 * @return {Promise} A Promise resolving model's input
 */
QueryAbstract.prototype.getInput = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
       try {
            resolve(_this.model.input);
       }
       catch (error) {
           reject(defines.errorStacker(error));
       }
    });
};

/**
 * @fn getInputLocal
 * @return {Promise} A promise resolving to the local input value
 */
QueryAbstract.prototype.getInputLocal = function() {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this.model.hasOwnProperty('input') && _this.model.input.hasOwnProperty('local'))
            resolve(_this.model.input.local);
        else
            reject(defines.errorStacker('No local input'));
    });
};

/**
 * @fn getInputStd
 * @return {Promise} A promise resolving to the standardized input
 */
QueryAbstract.prototype.getInputStd = function() {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this.model.hasOwnProperty('input') && _this.model.input.hasOwnProperty('std'))
            resolve(_this.model.input.std);
        else
            reject(defines.errorStacker('Missing standard input'));
    });
};

/**
 * @fn setInputStd
 * @param std_data The data object to transform and store
 * @return {Promise} A Promise resolving the stored model in local format
 */
QueryAbstract.prototype.setInputStd = function(std_data) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Transform to local format & Store into model
            _this.model.input.local = _this.input_standard2local(std_data);
            _this.model.input.std = std_data;
            //Send back local input
            resolve(_this.model.input.local);
        }
        catch (error) {
            reject(defines.errorStacker(error));
        }
    });
};

/**
 * @fn setInputLocal
 * @param local_data The data object to transform and store
 * @return {Promise} A Promise resolving the stored model to standard format
 */
QueryAbstract.prototype.setInputLocal = function(local_data) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Transform to local format
            let std_data = _this.input_local2standard(local_data);
            //Store into model
            _this.model.input.local = local_data;
            _this.model.input.std = std_data;
            //Send back std input
            resolve(_this.model.input.std);
        }
        catch (error) {
            reject(defines.errorStacker(error));
        }
    });
};

/**
 * @fn getOutput
 * @desc Retrieves output data from the model
 * @return {Promise} A Promise resolving to data model expanded with its content from storage
 */
QueryAbstract.prototype.getOutput = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        try {
            let data = _this.model.output;
            let promises = [
                _this.storage.getObject(data.local.dataId),
                _this.storage.getObject(data.std.dataId)
            ];
            Promise.all(promises).then(function (values) {
                data.local.data = values[0];
                data.std.data = values[1];
                resolve(data);
            }, function(error) {
                reject(defines.errorStacker(error));
            });
        }
        catch (error) {
            reject(defines.errorStacker('getOutput caught error', error));
        }
    });
};

/**
 * @fn getOutputLocal
 * @return {Promise} Resolves to output local data content
 */
QueryAbstract.prototype.getOutputLocal = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        if (_this.model.hasOwnProperty('output') && _this.model.output.hasOwnProperty('local')) {
            _this.storage.getObject(_this.model.output.local.dataId).then(function(local_data) {
                resolve(local_data);
            }, function (error) {
                reject(defines.errorStacker('Get local output failed', error));
            });
        }
        else {
            reject(defines.errorStacker('No local output data'));
        }
    });
};

/**
 * @fn getOutputStd
 * @return {Promise} Resolves to output standard data content
 */
QueryAbstract.prototype.getOutputStd = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        if (_this.model.hasOwnProperty('output') && _this.model.output.hasOwnProperty('std') &&
            _this.model.output.std.hasOwnProperty('dataId') &&
            _this.model.output.std.dataId !== null) {
            _this.storage.getObject(_this.model.output.std.dataId).then(function(std_data) {
                resolve(std_data);
            }, function (error) {
                reject(defines.errorStacker('Get std output failed', error));
            });
        }
        else {
            reject(defines.errorStacker('No std output data'));
        }
    });
};

/**
 * @fn setOutputLocal
 * @desc Stores the output data into the model from the local data format
 * @param local_data Output data in the local format
 * @return {Promise} A Promise resolving the output to standard data model
 */
QueryAbstract.prototype.setOutputLocal = function(local_data) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        try {
            // Compute std format
            let std_data = _this.output_local2standard(local_data);

            let promises = [];
            // Is it an update or a creation
            if (_this.model.output.local.hasOwnProperty('dataId') === false ||
                _this.model.output.local.dataId === null ||
                _this.model.output.local.dataId === undefined ||
                _this.model.output.local.dataId.length === 0 ||
                _this.model.output.std.hasOwnProperty('dataId') === false ||
                _this.model.output.std.dataId === null ||
                _this.model.output.std.dataId === undefined ||
                _this.model.output.std.dataId.length === 0) {
                promises.push(_this.storage.createObject(local_data));
                promises.push(_this.storage.createObject(std_data));
            } else {
                promises.push(_this.storage.setObject(_this.model.output.local.dataId, local_data));
                promises.push(_this.storage.setObject(_this.model.output.std.dataId, std_data));
            }

            Promise.all(promises).then(function(values) {
                // Update output model
                _this.model.output.local.dataSize = local_data.length;
                _this.model.output.std.dataSize = std_data.length;
                _this.model.output.local.dataId = values[0];
                _this.model.output.std.dataId = values[1];
                _this.pushModel().then(function() {
                    resolve(std_data);
                }, function (error) {
                    reject(defines.errorStacker('Save output locations failed', error));
                });
            }, function(error) {
                reject(defines.errorStacker(error));
            });
        }
        catch (error) {
            reject(defines.errorStacker('Caught exception', error));
        }
    });
};

/**
 * @fn setOutputStd
 * @desc Stores the output data into the model from the Std data format
 * @param std_data Output data in the standard format
 * @return {Promise} A Promise resolving the output to local data model
 */
QueryAbstract.prototype.setOutputStd = function(std_data) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Compute std format
            let local_data = _this.output_standard2local(std_data);

            let promises = [];
            //Is it an update or a creation
            if (_this.model.output.local.hasOwnProperty('dataId') === false ||
                _this.model.output.local.dataId === null ||
                _this.model.output.local.dataId === undefined ||
                _this.model.output.local.dataId.length === 0 ||
                _this.model.output.std.hasOwnProperty('dataId') === false ||
                _this.model.output.std.dataId === null ||
                _this.model.output.std.dataId === undefined ||
                _this.model.output.std.dataId.length === 0) {
                promises.push(_this.storage.createObject(local_data));
                promises.push(_this.storage.createObject(std_data));
            } else {
                promises.push(_this.storage.setObject(_this.model.output.local.dataId, local_data));
                promises.push(_this.storage.setObject(_this.model.output.std.dataId, std_data));
            }

            Promise.all(promises).then(function(values) {
                //Update output model
                _this.model.output.local.dataSize = local_data.length;
                _this.model.output.std.dataSize = std_data.length;
                _this.model.output.local.dataId = values[0];
                _this.model.output.std.dataId = values[1];
                _this.pushModel().then(function() {
                    resolve(local_data);
                }, function (error) {
                    reject(defines.errorStacker(error));
                });
            }, function(error) {
                reject(defines.errorStacker('Storage failed', error));
            });
        }
        catch (error) {
            reject(defines.errorStacker('Caught exception', error));
        }
    });
};

/**
 * @fn registerExecutionStart
 * @desc Update current model status to running execution
 * @return {Promise} Resolving to the new status
 */
QueryAbstract.prototype.registerExecutionStart = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        let new_status = Object.assign({}, defines.executionModel, {
            status: 'running',
            start: new Date(),
            end: null,
            info: 'Will perform query'
        });
        _this.model.status = new_status;
        _this.pushModel().then(function(__unused__model) {
            resolve(_this.model.status);
        }, function(error) {
            reject(defines.errorStacker('Starting execution update fail', error));
        });
    });
};

/**
 * @fn registerExecutionEnd
 * @desc Update current model status to execution success
 * @return {Promise} Resolving to the new status
 */
QueryAbstract.prototype.registerExecutionEnd = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        let new_status = Object.assign({}, _this.model.status, {
            status: 'done',
            end: new Date(),
            info: 'All good'
        });
        _this.model.status = new_status;
        _this.pushModel().then(function(__unused__model) {
            resolve(_this.model.status);
        }, function(error) {
            reject(defines.errorStacker('Ending execution update fail', error));
        });
    });
};

/**
 * @fn registerExecutionError
 * @desc Update current model status to error state
 * @return {Promise} Resolving to the new status
 */
QueryAbstract.prototype.registerExecutionError = function(errorObject) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        try {
            _this.model.status = Object.assign({}, _this.model.status, {
                status: 'error',
                end: new Date(),
                info: errorObject
            });
            _this.pushModel().then(function (__unused__model) {
                resolve(_this.model.status);
            }, function (error) {
                reject(defines.errorStacker('Error execution update fail', error));
            });
        }
        catch (exec_status_error) {
            reject(defines.errorStacker('Update exec status to error has thrown', exec_status_error));
        }
    });
};

/**
 * @fn fetchModel
 * @desc Overwrites this Query model with the one from the DB
 * @return {Promise} A Promise resolving to the synchronised model
 */
QueryAbstract.prototype.fetchModel = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        _this.queryCollection.findOne({_id: new ObjectID(_this.model['_id'])}).then(function(result) {
            _this.model = result;
            resolve(this.model);
        }, function(error) {
            reject(defines.errorStacker(error));
        });
    });
};

/**
 * @fn pushModel
 * @desc Overwrite the model inside the database with the current one.
 * @return {Promise} A Promise resolving to the synchronised model
 */
QueryAbstract.prototype.pushModel = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
       _this.queryCollection.findOneAndReplace({_id: new ObjectID(_this.model._id)}, _this.model).then(function(result) {
            if (result.ok === 1)
                resolve(_this.model);
            else
                reject(defines.errorStacker('Update query model failed',
                    { error : result.lastErrorObject.toString() }));
       }, function (error) {
          reject(defines.errorStacker('MongoDB error', error));
       });
    });
};

module.exports = QueryAbstract;
