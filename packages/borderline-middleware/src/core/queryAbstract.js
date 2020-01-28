const ObjectID = require('mongodb').ObjectID;
const { ErrorHelper, Models } = require('@borderline/utils');

/**
 * @fn QueryAbstract
 * @desc Implementation independent query representation. MUST be inherited by the specific implementations
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param storage Object storage instance to read/write query result
 * @constructor
 */
function QueryAbstract(queryModel, queryCollection, storage) {
    this._model = queryModel;
    this._queryCollection = queryCollection;
    this._storage = storage;

    // Bind public member functions
    this.getModel = QueryAbstract.prototype.getModel.bind(this);
    this.setModel = QueryAbstract.prototype.setModel.bind(this);
    this.getInputModel = QueryAbstract.prototype.getInputModel.bind(this);
    this.setInputModel = QueryAbstract.prototype.setInputModel.bind(this);
    this.getOutputModel = QueryAbstract.prototype.getOutputModel.bind(this);
    this.setOutputModel = QueryAbstract.prototype.setOutputModel.bind(this);
    this.updateExecutionStatus = QueryAbstract.prototype.updateExecutionStatus.bind(this);

    // Bind public pure virtual functions
    this.initialize = QueryAbstract.prototype.initialize.bind(this);
    this.execute = QueryAbstract.prototype.execute.bind(this);
    this.terminate = QueryAbstract.prototype.terminate.bind(this);
    this.interrupt = QueryAbstract.prototype.interrupt.bind(this);
    this.getInput = QueryAbstract.prototype.getInput.bind(this);
    this.setInput = QueryAbstract.prototype.setInput.bind(this);
    this.getOutput = QueryAbstract.prototype.getOutput.bind(this);
    this.setOutput = QueryAbstract.prototype.setOutput.bind(this);

    // Bind protected member functions
    this._pushModel = QueryAbstract.prototype._pushModel.bind(this);
    this._fetchModel = QueryAbstract.prototype._fetchModel.bind(this);
}


/**
 * @fn getModel
 * @desc Getter on internal model data structure
 * @return {Object} JSON object as stored in the DB
 */
QueryAbstract.prototype.getModel = function () {
    return this._model;
};

/**
 * @fn setModel
 * @desc Merges the provided model properties with the internal model
 * @param newModel JS object to merge in the model
 * @return {Object} Updated model
 */
QueryAbstract.prototype.setModel = function (newModel) {
    this._model = Object.assign({}, this._model, newModel);
    return this._model;
};

/**
 * @fn getInputModel
 * @desc Getter on the input description
 * @return {Array} Always returns an array of BL_DATA_MODEL
 */
QueryAbstract.prototype.getInputModel = function () {
    let input = [];

    if (this._model && Array.isArray(this._model.input))
        input = this._model.input;
    return input;
};

/**
 * @fn setInputModel
 * @desc Setter on the input model
 * @param data_models {Array | Object} Model of the data to store in the input description
 * @return This model input after update
 */
QueryAbstract.prototype.setInputModel = function (data_models) {
    if (Array.isArray(data_models))
        this._model = Object.assign({}, this._model, { input: data_models }); // Will always succeed and set the input field
    else
        this._model = Object.assign({}, this._model, { input: [data_models] }); // Will always succeed and set the input field
    return this._model.input;
};

/**
 * @fn getOutputModel
 * @desc Getter on the output description
 * @return {Array} Always returns an array of BL_DATA_MODEL
 */
QueryAbstract.prototype.getOutputModel = function () {
    let output = [];

    if (this._model && Array.isArray(this._model.output))
        output = this._model.output;
    return output;
};

/**
 * @fn setOutputModel
 * @desc Setter on the output model
 * @param data_models {Array | Object} Model of the data to store in the output description
 * @return This model output after update
 */
QueryAbstract.prototype.setOutputModel = function (data_models) {
    if (Array.isArray(data_models))
        this._model = Object.assign({}, this._model, { output: data_models }); // Will always succeed and set the output field
    else
        this._model = Object.assign({}, this._model, { output: [data_models] }); // Will always succeed and set the output field
    return this._model.output;
};

/**
 * @fn updateExecutionStatus
 * @param new_status_properties {Object}
 * @return {Promise}
 */
QueryAbstract.prototype.updateExecutionStatus = function (new_status_properties) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this._model.status = Object.assign({}, Models.BL_MODEL_EXECUTION,
            _this._model.status, new_status_properties);
        _this._pushModel().then(function () {
            resolve(true);
        }, function (push_error) {
            reject(ErrorHelper('Updating execution status failed', push_error));
        });
    });
};

/**
 * @fn initialize
 * @desc First stage execution of this query
 * @param __unused__request The Express.js HTTP request that triggered the execution
 */
QueryAbstract.prototype.initialize = function (__unused__request = null) {
    throw 'Pure implementation should not be called';
};

/**
 * @execute
 * @desc Core execution method of a query
 */
QueryAbstract.prototype.execute = function () {
    throw 'Pure implementation should not be called';
};

/**
 * @fn terminate
 * @desc Last execution stage to teardown after the core execution.
 */
QueryAbstract.prototype.terminate = function () {
    throw 'Pure implementation should not be called';
};

/**
 * @fn interrupt
 * @desc Attempts to interrupt at any stage
 */
QueryAbstract.prototype.interrupt = function () {
    throw 'Pure implementation should not be called';
};

QueryAbstract.prototype.getInput = function () {
    throw 'Pure implementation should not be called';
};

QueryAbstract.prototype.setInput = function () {
    throw 'Pure implementation should not be called';
};

QueryAbstract.prototype.getOutput = function () {
    throw 'Pure implementation should not be called';
};

QueryAbstract.prototype.setOutput = function () {
    throw 'Pure implementation should not be called';
};

/**
 * @fn fetchModel
 * @desc Overwrites this Query model with the one from the DB
 * @return {Promise} A Promise resolving to the synchronised model
 */
QueryAbstract.prototype._fetchModel = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this._queryCollection.findOne({ _id: new ObjectID(_this._model._id) }).then(function (result) {
            _this._model = result;
            resolve(_this._model);
        }, function (error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn pushModel
 * @desc Overwrite the model inside the database with the current one.
 * @return {Promise} A Promise resolving to the synchronised model
 */
QueryAbstract.prototype._pushModel = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this._queryCollection.findOneAndReplace({ _id: new ObjectID(_this._model._id) }, _this._model).then(function (result) {
            if (result.ok === 1)
                resolve(_this._model);
            else
                reject(ErrorHelper('Update query model failed', result.lastErrorObject.toString()));
        }, function (error) {
            reject(ErrorHelper('MongoDB error', error));
        });
    });
};

module.exports = QueryAbstract;
