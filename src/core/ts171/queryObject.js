// Vendor modules
const request = require('request');

// Local modules
const defines = require('../../defines.js');
const QueryAbstract = require('../queryAbstract.js');

/**
 * @fn QueryTransmart17_1
 * @desc Query Implementation for TranSMART 17.1
 * @param queryModel Plain JS Object, stored in DB
 * @param queryCollection MongoDB collection where the model is stored
 * @param queryGridFS MongoDB gridFS object to read/write query result
 * @constructor
 */
function QueryTransmart17_1(queryModel, queryCollection, queryGridFS) {
    QueryAbstract.call(this, queryModel, queryCollection, queryGridFS);
}
QueryTransmart17_1.prototype = Object.create(QueryAbstract.prototype); //Inherit Js style
QueryTransmart17_1.prototype.constructor = QueryTransmart17_1;

/**
 * @fn isAuth
 * @desc Returns true if this query has a non-expired token
 */
QueryTransmart17_1.prototype.isAuth = function() {
    //Needs first auth if Oauth token details are missing
    if (this.model.credentials.hasOwnProperty('access_token') === false ||
        this.model.credentials.hasOwnProperty('expires_in') === false ||
        this.model.credentials.hasOwnProperty('generated') === false)
        return false;

    var now = new Date();
    //Compute expiration date for this token
    var expires = new Date(this.model.credentials.generated);
    expires.setTime(expires.getTime() +  this.model.credentials.expires_in * 1000);
    //Compares now and expiration date
    return (now < expires);
};

/**
 * @fn _doAuth
 * @desc Gets a new token from TS endpoint and store it in DB
 * @return {Promise} Resolves ot true on success
 * @private
 */
QueryTransmart17_1.prototype._doAuth = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
        //Get new credentials from data source
        request.post({
            method: 'POST',
            json: true,
            baseUrl: _this.model.endpoint.sourceHost + ':' + _this.model.endpoint.sourcePort,
            uri: '/oauth/token?grant_type=password&client_id=glowingbear-js&client_secret=' +
            '&username=' + _this.model.credentials.username +
            '&password=' + _this.model.credentials.password
        }, function (error, response, body) {
            if (error !== null) {
                reject(defines.errorStacker(error));
                return;
            }
            else if (response === null || response.statusCode !== 200) { //Reject on errors
                reject(defines.errorStacker('Authentication failed'));
                return;
            }
            //Update queryModel
            var newCredentials = Object.assign({}, _this.model.credentials, body, {generated: new Date()});
            var newModel = Object.assign({}, _this.model, {credentials: newCredentials});
            _this.model = newModel;
            _this.pushModel().then(function() {
                resolve(true);
            }, function (error) {
                reject(defines.errorStacker('Auth save failed', error));
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
    var _this = this;
    return new Promise(function(resolve, reject) {
        if (_this.isAuth() == false) {
            _this._doAuth().then(function() {
                resolve(true);
            }, function (error) {
                reject(defines.errorStacker('Ensure auth failed', error));
            });
        }
        else {
            resolve(true);
        }
    });
};

/**
 * @fn execute
 * @desc Perform query on Transmart endpoint, stores and translate the outputs
 * @return {Promise} Execution status object on success
 */
QueryTransmart17_1.prototype.execute = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {

        _this.registerExecutionStart().then(function(status) {
            resolve(status);
        }, function (error) {
            reject(defines.errorStacker('Execution fail', error));
        });

        //Check for required fields
        if (!_this.model.hasOwnProperty('input') ||
            !_this.model.input.hasOwnProperty('local') ||
            !_this.model.input.local.hasOwnProperty('uri') ||
            !_this.model.input.local.hasOwnProperty('params')) {
            _this.registerExecutionError('Query input is not valid');
           return;
        }

        //Auth and perform execution against Transmart instance
        _this._ensureAuth().then(function() {
            request.get({
                baseUrl: _this.model.endpoint.sourceHost + ':' + _this.model.endpoint.sourcePort,
                uri: _this.model.input.local.uri + JSON.stringify(_this.model.input.local.params),
                headers: {
                    Authorization: 'Bearer ' + _this.model.credentials.access_token
                }
            }, function (error, response, body) {
                if (error !== null || response === null || response.statusCode !== 200) {
                    _this.registerExecutionError(defines.errorStacker('Execute request failed', error));
                    return;
                }
                _this.setOutputLocal(body).then(function(std_data) {
                    _this.registerExecutionEnd(); //Update status to done
                }, function(error) {
                    _this.registerExecutionError(defines.errorStacker('Exectution failed while saving result', error));
                });
            });
        }, function (error) {
            _this.registerExecutionError(defines.errorStacker('Authentication error while executing', error));
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
    //Todo
    return data;
};

/**
 * @fn output_standard2local
 * @todo Real Implementation
 * @param data A Standard output object to transform
 * @return Object transformed to local format
 */
QueryTransmart17_1.prototype.output_standard2local = function(data) {
    //todo
    return data;
};


module.exports = QueryTransmart17_1;