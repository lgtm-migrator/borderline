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
    QueryAbstract.call(this, queryModel, queryCollection, storage);

    // Bind member functions
    this.isAuth = QueryTransmart17_1.prototype.isAuth.bind(this);
    this._doAuth = QueryTransmart17_1.prototype._doAuth.bind(this);
    this._ensureAuth = QueryTransmart17_1.prototype._ensureAuth.bind(this);
    this.execute = QueryTransmart17_1.prototype.execute.bind(this);
}
QueryTransmart17_1.prototype = Object.create(QueryAbstract.prototype); //Inherit Js style
QueryTransmart17_1.prototype.constructor = QueryTransmart17_1;

/**
 * @fn isAuth
 * @desc Returns true if this query has a non-expired token
 */
QueryTransmart17_1.prototype.isAuth = function() {
    //Needs first auth if Oauth token details are missing
    if (this.hasOwnProperty('model') === false ||
        this.model.hasOwnProperty('credentials') === false ||
        this.model.credentials.hasOwnProperty('access_token') === false ||
        this.model.credentials.hasOwnProperty('expires_in') === false ||
        this.model.credentials.hasOwnProperty('generated') === false)
        return false;

    let now = new Date();
    //Compute expiration date for this token
    let expires = new Date(this.model.credentials.generated);
    expires.setTime(expires.getTime() +  this.model.credentials.expires_in * 1000);
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
            baseUrl: _this.model.endpoint.sourceHost + ':' + _this.model.endpoint.sourcePort,
            uri: '/oauth/token?grant_type=password&client_id=glowingbear-js' +
            '&username=' + _this.model.credentials.username +
            '&password=' + _this.model.credentials.password
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
            let newCredentials = Object.assign({}, _this.model.credentials, body, {generated: new Date()});
            _this.model = Object.assign({}, _this.model, {credentials: newCredentials});
            _this.pushModel().then(function() {
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
            if (_this.isAuth() === false) {
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
 * @fn execute
 * @desc Perform query on Transmart endpoint, stores and translate the outputs
 * @return {Promise} Execution status object on success
 */
QueryTransmart17_1.prototype.execute = function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
        _this.registerExecutionStart().then(function(status) {
            resolve(status);

            //Check for required fields
            if (_this.model.hasOwnProperty('input') === false ||
                _this.model.input.hasOwnProperty('local') === false ||
                _this.model.input.local.hasOwnProperty('uri') === false ||
                _this.model.input.local.hasOwnProperty('params') === false) {
                _this.registerExecutionError('Query input is not valid');
                return;
            }

            //Auth and perform execution against tranSmart instance
            _this._ensureAuth().then(function() {
                let uri_type_arg = _this.model.input.local.hasOwnProperty('type') ? ('&type=' + _this.model.input.local.type) : '';
                request.get({
                    baseUrl: _this.model.endpoint.sourceHost + ':' + _this.model.endpoint.sourcePort,
                    uri: _this.model.input.local.uri + JSON.stringify(_this.model.input.local.params) + uri_type_arg,
                    headers: {
                        Authorization: 'Bearer ' + _this.model.credentials.access_token
                    }
                }, function (error, response, body) {
                    if (error !== null || response === null || response.statusCode !== 200) {
                        if (body !== null)
                            error = ErrorHelper('Execute error body', body);
                        _this.registerExecutionError(ErrorHelper('Execute request failed', error));
                        return;
                    }
                    _this.setOutputLocal(body).then(function(__unused__std_data) {
                        _this.registerExecutionEnd(); //Update status to done
                    }, function(error) {
                        _this.registerExecutionError(ErrorHelper('Execution failed while saving result', error));
                    });
                });
            }, function (auth_error) {
                _this.registerExecutionError(ErrorHelper('Authentication error while executing', auth_error))
                    .catch(function(critical_error) {
                        console.error(ErrorHelper('Critical error', critical_error)); // eslint-disable-line no-console
                    });
            });
        }, function (error) { // Failed to update status to running
            reject(ErrorHelper('Execution fail', error));
        });
    });
};

/**
 * @fn input_local2standard
 * @todo Real implementation
 * @param data A TranSMART 17.1 query object to transform into standard query
 * @return Transformed to standard JS object
 */
QueryTransmart17_1.prototype.input_local2standard = function(data) {
    //Do nothing ATM
    return data;
};

/**
 * @fn input_standard2local
 * @todo Real implementation
 * @param data A Standard query input to transform to TranSMART 17.1 query object
 * @return Transformed to TS 17.1 object
 */
QueryTransmart17_1.prototype.input_standard2local = function(data) {
    //Do nothing.. Todo
    return data;
};

/**
 * @fn output_local2standard
 * @todo Real implementation
 * @param data A TranSMART 17.1 query object to transform
 * @return Output data in standard format
 */
QueryTransmart17_1.prototype.output_local2standard = function(data) {
    if (typeof data === 'object')
        return JSON.stringify(data);
    return data.toString();
};

/**
 * @fn output_standard2local
 * @todo Real Implementation
 * @param data A Standard output object to transform
 * @return Object transformed to local format
 */
QueryTransmart17_1.prototype.output_standard2local = function(data) {
    if (typeof data === 'object')
        return JSON.stringify(data);
    return data.toString();
};


module.exports = QueryTransmart17_1;
