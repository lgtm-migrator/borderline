const request = require('request');
const defines = require('../../defines');

function ExtensionQuery() {
    this.registryCollection = global.registry; // Defined in BorderlineServer main class

    //Bind member functions
    this._pickMiddleware = ExtensionQuery.prototype._pickMiddleware.bind(this);
    this._requestMaker = ExtensionQuery.prototype._requestMaker.bind(this);
}

/**
 * @fn _requestMaker
 * @desc Picks a middleware and perform a HTTP request from parameters
 * @param options HTTP request options object
 * @param error_message String to use on error
 * @return {Promise} Resolves to request result on success
 * @private
 */
ExtensionQuery.prototype._requestMaker = function(options, error_message) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this._pickMiddleware.then(function(middleware) {
            var req_options = Object.assign({}, {
                method: 'GET',
                json: true,
                baseUrl: middleware.ip + ':' + middleware.port,
                uri: ''
            }, options);
            var req = request(req_options, function(error, response, body) {
                if (error !== null && error !== undefined) {
                    reject(defines.errorStacker('Requesting middleware failed', error));
                    return;
                }
                if (response.statusCode !== 200) {
                    reject(defines.errorStacker(error_message, error));
                    return;
                }
                resolve(body);
            });
        }, function (error) {
            reject(defines.errorStacker('Cannot pick middleware', error));
        })
    });
};

/**
 * @fn _pickMiddleware
 * @desc Finds the first available middleware from the registry
 * @return {Promise} Resolves to the middleware registry model on success
 * @private
 */
ExtensionQuery.prototype._pickMiddleware = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
        //Get all middleware in the registry. Last updated goes first
        _this.registryCollection.find({type: 'borderline-middleware'}, {sort: "timestamp"}).toArray(function(err, entries) { //Error checking
            if (err !== null && err !== undefined) {
                reject(defines.errorStacker('Cannot list middleware from registry', err));
                return;
            }

            //Try to find the first online middleware
            for (var i = 0; i < entries.length; i++) {
                var now = new Date();
                var expires = new Date();
                expires.setDate(entries[i].timestamp.getDate() + entries[i].expires_in);

                if (expires > now) {
                    resolve(entries[i]);
                    return;
                }
            }
            //No match, handle error
            reject(defines.errorStacker('No middleware is available'));
        });
    });
};

/**
 * @fn createQuery
 * @desc Create a new query
 * @return {Promise}
 */
ExtensionQuery.prototype.createQuery = function() {
    const req_options = {
        uri: '/query/new'
    };
    return this._requestMaker(req_options, 'Middleware query creation failed');
};

/**
 * @fn getQueryStatus
 * @desc Retrieve the execution status of a query
 * @param query_id String of the query
 * @return {Promise}
 */
ExtensionQuery.prototype.getQueryStatus = function(query_id) {
    const req_options = {
        method: 'GET',
        uri: '/query/execute/' + query_id
    };
    return this._requestMaker(req_options, 'Middleware get status fails');
};

/**
 * @fn getQueryDataSourceID
 * @desc Get the data source associated with this query
 * @param query_id String unique identifier
 * @return {Promise} Resolves to the data source on success
 */
ExtensionQuery.prototype.getQueryDataSourceID = function(query_id) {
    const req_options = {
        method: 'GET',
        uri: '/query/' + query_id + '/endpoint'
    };
    return this._requestMaker(req_options, 'Middleware get data source failed');
};


/**
 * @fn setQueryDataSourceID
 * @desc Set the data source associated with this query
 * @param query_id String unique identifier
 * @param data_source The data source information to set
 * @return {Promise} Resolves to the updated data source
 */
ExtensionQuery.prototype.setQueryDataSourceID = function(query_id, data_source) {
    const req_options = {
        method: 'POST',
        uri: '/query/' + query_id + '/endpoint',
        body: data_source
    };
    return this._requestMaker(req_options, 'Middleware set data source failed');
};


/**
 * @fn getQueryCredentials
 * @desc Get the credentials associated with this query
 * @param query_id String unique identifier
 * @return {Promise} Resolves to the credentials
 */
ExtensionQuery.prototype.getQueryCredentials = function(query_id) {
    const req_options = {
        method: 'GET',
        uri: '/query/' + query_id + '/credentials'
    };
    return this._requestMaker(req_options, 'Middleware get credentials failed');
};


/**
 * @fn setQueryCredentials
 * @desc Set the credentials associated with this query
 * @param query_id String unique identifier
 * @param credentials New credentials to save
 * @return {Promise} Resolves to the credentials on success
 */
ExtensionQuery.prototype.setQueryCredentials = function(query_id, credentials) {
    const req_options = {
        method: 'POST',
        uri: '/query/' + query_id + '/credentials',
        body: credentials
    };
    return this._requestMaker(req_options, 'Middleware set credentials failed');
};

/**
 * @fn getQueryConfig
 * @desc Get the config associated with this query
 * @param query_id String unique identifier
 * @return {Promise} Resolves to the config on success
 */
ExtensionQuery.prototype.getQueryConfig = function(query_id) {
    const req_options = {
        method: 'GET',
        uri: '/query/' + query_id + '/input'
    };
    return this._requestMaker(req_options, 'Middleware get config failed');
};
/**
 * @fn setQueryConfig
 * @desc Set the config associated with this query
 * @param query_id String unique identifier
 * @param config New config to save
 * @return {Promise} Resolves to the config on success
 */
ExtensionQuery.prototype.setQueryConfig = function(query_id, config) {
    const req_options = {
        method: 'POST',
        uri: '/query/' + query_id + '/input',
        body: config
    };
    return this._requestMaker(req_options, 'Middleware set config failed');
};

/**
 * @fn getQueryStorage
 * @desc Get the storage object for a query result
 * @param query_id String unique identifier
 * @return {Promise} Resolves to the storage object unique identifier
 */
ExtensionQuery.prototype.getQueryStorage = function(query_id) {
    const req_options = {
        method: 'GET',
        uri: '/query/' + query_id + '/output'
    };
    return this._requestMaker(req_options, 'Middleware get result failed');
};

/**
 * @fn executeQuery
 * @desc Triggers execution of a query
 * @param query_id String unique identifier
 * @return {Promise} Resolves to the execution status on success
 */
ExtensionQuery.prototype.executeQuery = function(query_id) {
    const req_options = {
        method: 'POST',
        uri: '/execute',
        body: {
            query_id: query_id,
            nocache: false
        }
    };
    return this._requestMaker(req_options, 'Middleware execute failed');
};
