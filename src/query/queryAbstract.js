const defines = require('../defines.js');
const ObjectID = require('mongodb').ObjectID;

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
}

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
 * @return A Promise resolving model's input to standard format
 */
QueryAbstract.prototype.getInput = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
       try {
            resolve(_this.model.input);
       }
       catch (error) {
           reject({error: error.toString()});
       }
    });
};

/**
 * @fn getInputLocal
 * @return A promise resolving to the local input value
 */
QueryAbstract.prototype.getInputLocal = function() {
    var _this = this;
    return new Promise(function (resolve, reject) {
        if (_this.model.hasOwnProperty('input') && _this.model.input.hasOwnProperty('local'))
            resolve(_this.model.input.local);
        else
            reject('This query does\'nt have a local input');
    });
};

/**
 * @fn getInputStd
 * @return A promise resolving to the standardized input
 */
QueryAbstract.prototype.getInputStd = function() {
    var _this = this;
    return new Promise(function (resolve, reject) {
        if (_this.model.hasOwnProperty('input') && _this.model.input.hasOwnProperty('std'))
            resolve(_this.model.input.std);
        else
            reject('This query does\'nt have a standard input');
    });
};

/**
 * @fn setInputStd
 * @param std_data The data object to transform and store
 * @return A Promise resolving the stored model in local format
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
            reject({error: error});
        }
    });
};

/**
 * @fn setInputLocal
 * @param local_data The data object to transform and store
 * @return A Promise resolving the stored model to standard format
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
            reject({error: error});
        }
    });
};

/**
 * @fn getOutput
 * @desc Retrieves standard output data from the local data format in the model
 * @return A Promise resolving the output to standard data model
 */
QueryAbstract.prototype.getOutput = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            var data = { local: null, std: null };
            if (_this.model.output.local.isGridFS) {
                data = "";
                var ds = _this.queryGridFS.openDownloadStreamByName(this.model.output.data);
                ds.on('data', function (chunk) {
                    data += chunk
                });
                ds.on('end', function () {
                    resolve(_this.output_local2standard(data));
                })
            }
            else { //Is plain in the object
                data = _this.model.output.data;
                resolve(_this.output_local2standard(data));
            }
        }
        catch (error) {
            reject({ error: error });
        }
    });
};

/**
 * @fn setOutput
 * @desc Stores the output data into the model, using local data format
 * @param data Output data in the standard format
 * @return A Promise resolving the output to standard data model
 */
QueryAbstract.prototype.setOutput = function(data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //Compute std format
            var local_data = _this.output_standard2local(data);
            //Update output size
            _this.model.output.dataSize = local_data.length;

            if (_this.model.output.dataSize >= defines.thresholdGridFS) {
                //Will be stored in grid FS
                _this.model.output.isGridFS = true;

                var dataFile = _this.model['_id'].toString() + '.output';
                var us = _this.queryGridFS.openUploadStream(dataFile);
                us.end(local_data);
                _this.model.output.data = dataFile;
            }
            else {
                //Will be stored in plain object
                _this.model.output.isGridFS = false;

                _this.model.output.data = local_data;
            }
            resolve(data);
        }
        catch (error) {
            reject({ error: error });
        }
    });
};

/**
 * @fn fetchModel
 * @desc Overwrites this Query model with the one from the DB
 * @return A Promise resolving to the synchronised model
 */
QueryAbstract.prototype.fetchModel = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.queryCollection.findOne({_id: new ObjectID(_this.model['_id'])}).then(function(result) {
            _this.model = result;
            resolve(this._model);
        }, function(error) {
            reject({error: error});
        });
    });
};

/**
 * @fn pushModel
 * @desc Overwrite the model inside the databasewith the current one.
 * @return A Promise resolving to the synchronised model
 */
QueryAbstract.prototype.pushModel = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
       _this.queryCollection.findOneAndReplace({_id: new ObjectID(this.model['_id'])}, _this.model).then(function(result) {
            if (result.ok = 1)
                resolve(_this.model);
            else
                reject({ error : result.lastErrorObject.toString() });
       }, function (error) {
          reject({error: error});
       });
    });
};

module.exports = QueryAbstract;