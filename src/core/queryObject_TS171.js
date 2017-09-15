const request = require('request');
const { ErrorHelper, Models } = require('borderline-utils');
const QueryAbstract = require('./queryAbstract.js');

/**
 * @fn QueryTransmart17_1
 * @desc Query Implementation for TranSMART 17.1
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param storage Object storage instance to read/write query result
 * @constructor
 */
function QueryTransmart17_1(queryModel, queryCollection, storage) {
    // Call super constructor
    QueryAbstract.call(this, queryModel, queryCollection, storage);

    // Init member vars
    this._query_request = null;
    this._query_result = null;

    // Bind Abstract interface implementation
    this.initialize = QueryTransmart17_1.prototype.initialize.bind(this);
    this.execute = QueryTransmart17_1.prototype.execute.bind(this);
    this.terminate = QueryTransmart17_1.prototype.terminate.bind(this);
    this.interrupt = QueryTransmart17_1.prototype.interrupt.bind(this);
    this.getInput = QueryTransmart17_1.prototype.getInput.bind(this);
    this.setInput = QueryTransmart17_1.prototype.setInput.bind(this);
    this.getOutput = QueryTransmart17_1.prototype.getOutput.bind(this);
    this.setOutput = QueryTransmart17_1.prototype.setOutput.bind(this);

    // Bind private member functions
    this._isAuth = QueryTransmart17_1.prototype._isAuth.bind(this);
    this._doAuth = QueryTransmart17_1.prototype._doAuth.bind(this);
    this._ensureAuth = QueryTransmart17_1.prototype._ensureAuth.bind(this);
    this._stdToTransmart = QueryTransmart17_1.prototype._stdToTransmart.bind(this);
    this._transmartToStd = QueryTransmart17_1.prototype._transmartToStd.bind(this);
}
QueryTransmart17_1.prototype = Object.create(QueryAbstract.prototype); //Inherit Js style
QueryTransmart17_1.prototype.constructor = QueryTransmart17_1;

/**
 * @fn initialize
 * @desc Prepare the query execution by authenticating to the Transmart 17.1 endpoint
 * @return {Promise} Resolve to true or rejects an error stack
 */
QueryTransmart17_1.prototype.initialize = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        _this._ensureAuth().then(function() {
            resolve(true);
        }, function(auth_error) {
            reject(ErrorHelper('TS17.1 init query failed', auth_error));
        });
    });
};

/**
 * @fn execute
 * @desc Performs the execution of the query. For TS17.1, sends the request to the endpoint
 * @return {Promise} Resolve to true on success or reject the ErrorHelper when it goes wrong
 */
QueryTransmart17_1.prototype.execute = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        let credentials = _this.getModel().credentials;
        let endpoint = _this.getModel().endpoint;
        let input = _this.getInputModel()[0].metadata; // TS17.1 query data is here in the right format
        let uri_type_arg = input.hasOwnProperty('type') ? ('&type=' + input.type) : '';
        _this._query_request = request.get({
            baseUrl: endpoint.sourceHost + ':' + endpoint.sourcePort,
            uri: input.uri + JSON.stringify(input.params) + uri_type_arg,
            headers: {
                Authorization: 'Bearer ' + credentials.access_token
            }
        }, function (error, response, body) {
            if (error !== null || response === null || response.statusCode !== 200) {
                if (body !== null)
                    error = ErrorHelper('Execute error body', body);
                reject(ErrorHelper('Execute request failed', error));
            }
            else {
                // Store locally the result
                _this._query_result = body;
                resolve(true);
            }
        });
    });
};

/**
 * @fn terminate
 * @desc Stores the query output
 * @return {Promise} Resolve to the output dataModel on success, error otherwise
 */
QueryTransmart17_1.prototype.terminate = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        let query_result = _this._query_result;
        if (query_result) {
            _this.setOutput(query_result).then(function(data_model) {
                resolve(data_model);
            }, function(output_error) {
                reject(ErrorHelper('Terminate TS171 saving output failed', output_error));
            });
        }
        else {
            reject(ErrorHelper('Terminate QueryTS17.1 has no result after execution'));
        }
    });
};

/**
 * @fn interrupt
 * @desc Attempts to interrupt the current query
 */
QueryTransmart17_1.prototype.interrupt = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        if (_this._query_request) {
            _this._query_request.abort();
            resolve(true);
        }
        else {
            reject(ErrorHelper('TS17.1 query is not running'));
        }
    });
};

/**
 * @fn getInput
 * @desc Getter on this query std Input
 * @return {Promise} Resolve to the query input data in std format, or rejects ErrorHelper
 */
QueryTransmart17_1.prototype.getInput = function() {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this._model.input && _this._model.input.length === 1) {
            let input_model = _this._model.input[0]; // Only one input for TS171 queries
            if (input_model.metadata) {
                // Input is stored in Transmart format, so we convert back to std
                resolve(_this._transmartToStd(input_model.metadata));
            }
            else {
                reject(ErrorHelper('Query TS171 input is empty'));
            }
        }
        else {
            reject(ErrorHelper('Query TS171 doesnt have an input'));
        }
    });
};

/**
 * @fn setInput
 * @desc Update this query Input data directly as metadata, and updating the model.
 * @warning Internal storage format of the input is the Transmart 17.1 format
 * @param data Std query data to store
 * @return {Promise} Resolve to the data model on success or reject an error
 */
QueryTransmart17_1.prototype.setInput = function(data) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        let data_model = Object.assign({}, Models.BL_MODEL_DATA,
            {
                metadata: _this._stdToTransmart(data) // Transform std query to transmart
            });
        _this.setInputModel(data_model);
        _this._pushModel().then(function() {
            resolve(data_model);
        }, function(push_error) {
            reject(ErrorHelper('Saving the input query model failed', push_error));
        });
    });
};

/**
 * @fn getOutput
 * @desc Getter on this TS171 output. Reads the data stored in the object cache if any
 * @return {Promise} Resolves to the std data on success, reject if data is missing or error occurs
 */
QueryTransmart17_1.prototype.getOutput = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        if (_this._model.output && _this._model.output.length === 1) {
            let output_model = _this._model.output[0]; // Only one output from TS171 queries
            if (output_model.cache && output_model.cache.dataSize && output_model.cache.storageId) {
                _this._storage.getObject(output_model.cache.storageId).then(function (data) {
                    // Data is already in std format
                    // But its stored as raw binary, so convert back to JSON
                    resolve(JSON.parse(data));
                }, function (storage_error) {
                    reject(ErrorHelper('Getting output from storage failed', storage_error));
                });
            }
            else {
                reject(ErrorHelper('Query TS171 doesnt have cached output'));
            }
        }
        else {
            reject(ErrorHelper('Query TS171 doesnt have output'));
        }
    });
};

/**
 * @fn setOutput
 * @desc Update this query Output data by storing the data in the cache, and updating the model
 * @param data Raw data to store in Std format
 * @return {Promise} Resolve to the data model on success or reject an error
 */
QueryTransmart17_1.prototype.setOutput = function(data) {
    let _this = this;
    return new Promise(function(resolve, reject) {
        // Store the data in STD format
        let std_data = _this._transmartToStd(data);
        let bytes_data = JSON.stringify(std_data);
        // Todo: Should erase of the old storage object if any
        _this._storage.createObject(bytes_data).then(function(storage_id) {
            // Update model to remember where we stored the data
            let data_model = Object.assign({}, Models.BL_MODEL_DATA,
                {
                    cache: {
                        dataSize: bytes_data.length,
                        storageId: storage_id
                    }
                });
            _this.setOutputModel(data_model);
            _this._pushModel().then(function() {
                resolve(data_model);
            }, function(push_error) {
               reject(ErrorHelper('Saving output query model failed', push_error));
            });
        }, function(storage_error) {
            reject(ErrorHelper('Caching output in storage failed', storage_error));
        });
    });
};

/**
 * @fn isAuth
 * @desc Returns true if this query has a non-expired token
 */
QueryTransmart17_1.prototype._isAuth = function() {
    //Needs first auth if Oauth token details are missing
    if (this.hasOwnProperty('model') === false ||
        this._model.hasOwnProperty('credentials') === false ||
        this._model.credentials.hasOwnProperty('access_token') === false ||
        this._model.credentials.hasOwnProperty('expires_in') === false ||
        this._model.credentials.hasOwnProperty('generated') === false)
        return false;

    let now = new Date();
    //Compute expiration date for this token
    let expires = new Date(this._model.credentials.generated);
    expires.setTime(expires.getTime() +  this._model.credentials.expires_in * 1000);
    //Compares now and expiration date
    return (now < expires);
};

/**
 * @fn _doAuth
 * @desc Gets a new token from TS endpoint and store it in DB
 * @return {Promise} Resolves to true on success
 * @private
 */
QueryTransmart17_1.prototype._doAuth = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        //Get new credentials from data source
        request.post({
            method: 'POST',
            json: true,
            baseUrl: _this._model.endpoint.sourceHost + ':' + _this._model.endpoint.sourcePort,
            uri: '/oauth/token?grant_type=password&client_id=glowingbear-js' +
            '&username=' + _this._model.credentials.username +
            '&password=' + _this._model.credentials.password
        }, function (error, response, body) {
            if (error !== null) {
                reject(ErrorHelper('Auth request failed', error));
                return;
            }
            else if (response === null || response.statusCode !== 200) { // Reject on errors
                reject(ErrorHelper('Authentication url is invalid'));
                return;
            }
            else if (body === undefined || body === null || body.hasOwnProperty('access_token') === false) {
                reject(ErrorHelper('Authentication failed'));
                return;
            }

            // Update queryModel
            let newCredentials = Object.assign({}, _this._model.credentials, body, { generated: new Date()});
            _this._model = Object.assign({}, _this._model, {credentials: newCredentials});
            _this._pushModel().then(function() {
                resolve(true);
            }, function (error) {
                reject(ErrorHelper('Auth save failed', error));
            });
        });
    });
};

/**
 * @fn _ensureAuth
 * @desc Makes sure this query has a valid OAuth Bearer token
 * @private
 */
QueryTransmart17_1.prototype._ensureAuth = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        try {
            if (_this._isAuth() === false) {
                _this._doAuth().then(function () {
                    resolve(true);
                }, function (error) {
                    reject(ErrorHelper('Ensure auth failed', error));
                });
            }
            else {
                resolve(true);
            }
        }
        catch (auth_err) {
            reject(ErrorHelper('Authentication check has thrown', auth_err));
        }
    });
};

/**
 * @fn _stdToTransmart
 * @param std_data Chunk on standar query data to convert
 * @return Chunk of transmart specific data
 * @warning This method does nothing because we don't have a standard query language yet
 * @private
 */
QueryTransmart17_1.prototype._stdToTransmart = function(std_data) {
    return std_data;
};

/**
 * @fn _transmartToStd
 * @param transmart_data Chunk on trasnmart extracted data to convert
 * @return Chunk of data in the standard query format
 * @warning This method does nothing because we don't have a standard query language yet
 * @private
 */
QueryTransmart17_1.prototype._transmartToStd = function(transmart_data) {
    return transmart_data;
};

module.exports = QueryTransmart17_1;
