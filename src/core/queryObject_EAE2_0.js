const request = require('request');
const { ErrorHelper, Models } = require('borderline-utils');
const QueryAbstract = require('./queryAbstract.js');

/**
 * @fn QueryEAE2_0
 * @desc Query Implementation for eAE 2.0
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param storage Object storage instance to read/write query result
 * @constructor
 */
function QueryEAE2_0(queryModel, queryCollection, storage) {
    // Call super constructor
    QueryAbstract.call(this, queryModel, queryCollection, storage);

    // Init member vars
    this._query_request = null;
    this._query_result = null;

    // Bind Abstract interface implementation
    this.initialize = QueryEAE2_0.prototype.initialize.bind(this);
    this.execute = QueryEAE2_0.prototype.execute.bind(this);
    this.terminate = QueryEAE2_0.prototype.terminate.bind(this);
    this.interrupt = QueryEAE2_0.prototype.interrupt.bind(this);
    this.getInput = QueryEAE2_0.prototype.getInput.bind(this);
    this.setInput = QueryEAE2_0.prototype.setInput.bind(this);
    this.getOutput = QueryEAE2_0.prototype.getOutput.bind(this);
    this.setOutput = QueryEAE2_0.prototype.setOutput.bind(this);

    // Bind private member functions
    this._stdToTransmart = QueryEAE2_0.prototype._stdToTransmart.bind(this);
    this._transmartToStd = QueryEAE2_0.prototype._transmartToStd.bind(this);
}
QueryEAE2_0.prototype = Object.create(QueryAbstract.prototype); //Inherit Js style
QueryEAE2_0.prototype.constructor = QueryEAE2_0;

/**
 * @fn initialize
 * @desc Prepare the query execution by authenticating to the eAE 2.0 endpoint
 * @return {Promise} Resolve to true or rejects an error stack
 */
QueryEAE2_0.prototype.initialize = function () {
    return Promise.resolve(true);
};

/**
 * @fn execute
 * @desc Performs the execution of the query. For eAE 2.0, sends the request to the endpoint
 * @return {Promise} Resolve to true on success or reject the ErrorHelper when it goes wrong
 */
QueryEAE2_0.prototype.execute = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let credentials = _this.getModel().credentials;
        let endpoint = _this.getModel().endpoint;
        let input = _this.getInputModel()[0].metadata;
        _this._query_request = request.post({
            baseUrl: endpoint.protocol + '://' + endpoint.host + ':' + endpoint.port + endpoint.baseUrl,
            uri: '/job/create',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
            body: {
                eaeUsername: credentials.username,
                eaeUserToken: credentials.password,
                job: JSON.stringify(input.job)
            }
        }, function (error, response, body) {
            if (error !== null || response === null || response.statusCode !== 200) {
                if (body !== null)
                    error = ErrorHelper('Execute error body', body);
                reject(ErrorHelper('Execute request failed', error));
            }
            else {
                // Wait for the analysis to be finished
                console.debug("Job has been created");
                resolve(_this._awaitResult(body));
            }
        });
    });
};

/**
 * @fn terminate
 * @desc Stores the query output
 * @return {Promise} Resolve to the output dataModel on success, error otherwise
 */
QueryEAE2_0.prototype.terminate = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let query_result = _this._query_result;
        if (query_result) {
            _this.setOutput(query_result).then(function (data_model) {
                resolve(data_model);
            }, function (output_error) {
                reject(ErrorHelper('Terminate EAE2_0 saving output failed', output_error));
            });
        }
        else {
            reject(ErrorHelper('Terminate QueryeAE 2.0 has no result after execution'));
        }
    });
};

/**
 * @fn interrupt
 * @desc Attempts to interrupt the current query
 */
QueryEAE2_0.prototype.interrupt = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this._query_request) {
            _this._query_request.abort();
            resolve(true);
        }
        else {
            reject(ErrorHelper('eAE 2.0 query is not running'));
        }
    });
};

/**
 * @fn getInput
 * @desc Getter on this query std Input
 * @return {Promise} Resolve to the query input data in std format, or rejects ErrorHelper
 */
QueryEAE2_0.prototype.getInput = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this._model.input && _this._model.input.length === 1) {
            let input_model = _this._model.input[0]; // Only one input for EAE2_0 queries
            if (input_model.metadata) {
                // Input is stored in Transmart format, so we convert back to std
                resolve(_this._transmartToStd(input_model.metadata));
            }
            else {
                reject(ErrorHelper('Query EAE2_0 input is empty'));
            }
        }
        else {
            reject(ErrorHelper('Query EAE2_0 doesnt have an input'));
        }
    });
};

/**
 * @fn setInput
 * @desc Update this query Input data directly as metadata, and updating the model.
 * @warning Internal storage format of the input is the eAE 2.0 format
 * @param data Std query data to store
 * @return {Promise} Resolve to the data model on success or reject an error
 */
QueryEAE2_0.prototype.setInput = function (data) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let data_model = Object.assign({}, Models.BL_MODEL_DATA,
            {
                metadata: _this._stdToTransmart(data) // Transform std query to transmart
            });
        _this.setInputModel(data_model);
        _this._pushModel().then(function () {
            resolve(data_model);
        }, function (push_error) {
            reject(ErrorHelper('Saving the input query model failed', push_error));
        });
    });
};

/**
 * @fn getOutput
 * @desc Getter on this EAE2_0 output. Reads the data stored in the object cache if any
 * @return {Promise} Resolves to the std data on success, reject if data is missing or error occurs
 */
QueryEAE2_0.prototype.getOutput = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this._model.output && _this._model.output.length === 1) {
            let output_model = _this._model.output[0]; // Only one output from EAE2_0 queries
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
                reject(ErrorHelper('Query EAE2_0 doesnt have cached output'));
            }
        }
        else {
            reject(ErrorHelper('Query EAE2_0 doesnt have output'));
        }
    });
};

/**
 * @fn setOutput
 * @desc Update this query Output data by storing the data in the cache, and updating the model
 * @param data Raw data to store in Std format
 * @return {Promise} Resolve to the data model on success or reject an error
 */
QueryEAE2_0.prototype.setOutput = function (data) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        // Store the data in STD format
        let std_data = _this._transmartToStd(data);
        let bytes_data = JSON.stringify(std_data);
        // Todo: Should erase of the old storage object if any
        _this._storage.createObject(bytes_data).then(function (storage_id) {
            // Update model to remember where we stored the data
            let data_model = Object.assign({}, Models.BL_MODEL_DATA,
                {
                    cache: {
                        dataSize: bytes_data.length,
                        storageId: storage_id
                    }
                });
            _this.setOutputModel(data_model);
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
 * @fn _awaitResult
 * @param job_info Job object return by EAE 2.0 after creation
 * @return Promise to a result or more waiting
 * @private
 */
QueryEAE2_0.prototype._awaitResult = function (job_info) {
    let _this = this;
    console.debug("Waiting 5 seconds _awaitResult");
    return new Promise(function (resolve) {
        setTimeout(resolve(new Promise(function (resolve, reject) {
            console.debug("_awaitResult trigger");
            let credentials = _this.getModel().credentials;
            let endpoint = _this.getModel().endpoint;
            request.post({
                baseUrl: endpoint.protocol + '://' + endpoint.host + ':' + endpoint.port + endpoint.baseUrl,
                uri: '/job',
                headers: {
                    'Content-Type': 'application/json'
                },
                json: true,
                body: {
                    eaeUsername: credentials.username,
                    eaeUserToken: credentials.password,
                    jobID: job_info.jobID
                }
            }, function (error, response, body) {
                if (error !== null || response === null || response.statusCode !== 200) {
                    if (body !== null)
                        error = ErrorHelper('Execute error body', body);
                    reject(ErrorHelper('Execute request failed', error));
                }
                else {
                    // Wait for the analysis to be finished
                    console.debug("Checking await result", body);
                    if (body.statusLock === true)
                        resolve(_this._awaitResult(job_info));
                    resolve(_this._fetchResult(body));
                }
            });
        })), 1000);
    });
};

/**
 * @fn _fetchResult
 * @param job_info Job object return by EAE 2.0 after creation
 * @return Chunk of transmart specific data
 * @private
 */
QueryEAE2_0.prototype._fetchResult = function (job_info) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        console.debug("_fetchResult trigger");
        let credentials = _this.getModel().credentials;
        let endpoint = _this.getModel().endpoint;
        request.post({
            baseUrl: endpoint.protocol + '://' + endpoint.host + ':' + endpoint.port + endpoint.baseUrl,
            uri: '/job',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
            body: {
                eaeUsername: credentials.username,
                eaeUserToken: credentials.password,
                jobID: job_info.jobID
            }
        }, function (error, response, body) {
            if (error !== null || response === null || response.statusCode !== 200) {
                if (body !== null)
                    error = ErrorHelper('Execute error body', body);
                reject(ErrorHelper('Execute request failed', error));
            }
            else {
                // Store locally the result
                console.debug("Finish and resolve", body);
                _this._query_result = body;
                resolve(true);
            }
        });
    });
};


/**
 * @fn _stdToTransmart
 * @param std_data Chunk on standar query data to convert
 * @return Chunk of transmart specific data
 * @warning This method does nothing because we don't have a standard query language yet
 * @private
 */
QueryEAE2_0.prototype._stdToTransmart = function (std_data) {
    return std_data;
};

/**
 * @fn _transmartToStd
 * @param transmart_data Chunk on trasnmart extracted data to convert
 * @return Chunk of data in the standard query format
 * @warning This method does nothing because we don't have a standard query language yet
 * @private
 */
QueryEAE2_0.prototype._transmartToStd = function (transmart_data) {
    return transmart_data;
};

module.exports = QueryEAE2_0;
