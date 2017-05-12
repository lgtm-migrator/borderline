// Vendor modules
const ObjectID = require('mongodb').ObjectID;

// Local modules
const defines = require('../defines.js');
const ObjectStorage = require('./objectStorage.js');

/**
 * @fn QueryAbstract
 * @desc Implementation independent query representation. MUST be inherited by the specific implementations
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param queryGridFS MongoDB gridFS object to read/write query result
 * @constructor
 */
function QueryAbstract(queryModel, queryCollection, queryGridFS) {
    this.model = queryModel;
    this.queryCollection = queryCollection;
    this.queryGridFS = queryGridFS;
    this.storage = new ObjectStorage(this.queryGridFS);
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
 * @pure
 */
QueryAbstract.prototype.execute = function() {
  throw "Execute should be overloaded by implementations";
};

/**
 * @fn input_local2standard
 * @pure
 */
QueryAbstract.prototype.input_local2standard = function(data) {
    throw "Input local to standard should be overloaded";
};
/**
 * @fn input_standard2local
 * @pure
 */
QueryAbstract.prototype.input_standard2local = function(data) {
    throw "Input standard to local should be overloaded";
};
/**
 * @fn output_local2standard
 * @pure
 */
QueryAbstract.prototype.output_local2standard = function(data) {
    throw "Output local to standard should be overloaded";
};
/**
 * @fn output_standard2local
 * @pure
 */
QueryAbstract.prototype.output_standard2local = function(data) {
    throw "Output standard to local should be overloaded";
};

/**
 * @fn getInput
 * @return {Promise} A Promise resolving model's input
 */
QueryAbstract.prototype.getInput = function() {
    var _this = this;
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
    var _this = this;
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
    var _this = this;
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
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Transform to local format
            var local_data = _this.input_standard2local(std_data);
            //Store into model
            _this.model.input.local = local_data;
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
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Transform to local format
            var std_data = _this.input_local2standard(local_data);
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
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            var data = _this.model.output;
            var promises = [
                _this.storage.getObject(data.local.dataId),
                _this.storage.getObject(data.std.dataId)
            ];
            Promise.all(promises).then(function (values) {
                data.local.data = values[0];
                data.std.data = values[1];
                resolve(data);
            }, function(error) {
                reject(defines.errorStacker(error));
            })
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
    var _this = this;
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
    var _this = this;
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
 * @param data Output data in the local format
 * @return {Promise} A Promise resolving the output to standard data model
 */
QueryAbstract.prototype.setOutputLocal = function(local_data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Compute std format
            var std_data = _this.output_local2standard(local_data);

            var promises = [];
            //Is it an update or a creation
            if (_this.model.output.local.hasOwnProperty('dataId') === false ||
                _this.model.output.local.dataId === null ||
                _this.model.output.local.dataId.length == 0 ||
                _this.model.output.std.hasOwnProperty('dataId') === false ||
                _this.model.output.std === null ||
                _this.model.output.std.dataId.length == 0) {
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
 * @param data Output data in the standard format
 * @return {Promise} A Promise resolving the output to local data model
 */
QueryAbstract.prototype.setOutputStd = function(std_data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Compute std format
            var local_data = _this.output_standard2local(std_data);

            var promises = [];
            //Is it an update or a creation
            if (_this.model.output.local.hasOwnProperty('dataId') === false ||
                _this.model.output.local.dataId === null ||
                _this.model.output.local.dataId.length == 0 ||
                _this.model.output.std.hasOwnProperty('dataId') === false ||
                _this.model.output.std === null ||
                _this.model.output.std.dataId.length == 0) {
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
 * @fn fetchModel
 * @desc Overwrites this Query model with the one from the DB
 * @return {Promise} A Promise resolving to the synchronised model
 */
QueryAbstract.prototype.fetchModel = function() {
    var _this = this;
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
 * @desc Overwrite the model inside the databasewith the current one.
 * @return {Promise} A Promise resolving to the synchronised model
 */
QueryAbstract.prototype.pushModel = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
       _this.queryCollection.findOneAndReplace({_id: new ObjectID(_this.model._id)}, _this.model).then(function(result) {
            if (result.ok == 1)
                resolve(_this.model);
            else
                reject(defines.errorStacker('Update query model failed',
                    { error : result.lastErrorObject.toString() }));
       }, function (error) {
          reject(defines.errorStacker(error));
       });
    });
};

module.exports = QueryAbstract;