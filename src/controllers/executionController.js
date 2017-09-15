const QueryFactory = require('../core/queryFactory.js');
const { ErrorHelper, Constants } = require('borderline-utils');

/**
 * @fn ExecutionController
 * @desc Manager for the execution related endpoints
 * @param queryCollection MongoDB collection queries storage
 * @param storage Object storage abstract class instance used by some query results
 * @constructor
 */
function ExecutionController(queryCollection, storage) {
    // Init member vars
    this.queryCollection = queryCollection;
    this.storage = storage;
    this.queryFactory = new QueryFactory(queryCollection, storage);
    this._execution_promises = [];

    // Bind public member functions
    this.executeQueryByID = ExecutionController.prototype.executeQueryByID.bind(this);
    this.getQueryStatusById = ExecutionController.prototype.getQueryStatusById.bind(this);

    // Bind private member functions
    this._internalExecutor = ExecutionController.prototype._internalExecutor.bind(this);
}

/**
 * @fn executeQueryByID
 * @desc Executes the query identified by the query_id
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExecutionController.prototype.executeQueryByID = function(req, res) {
    let _this = this;

    let query_id = req.params.query_id;
    if (query_id === null || query_id === undefined) {
        res.status(401);
        res.json({error: 'Missing query_id'});
    }
    else {
        _this.queryFactory.fromID(query_id).then(function(queryObject) {
            let exec_promise = _this._internalExecutor(queryObject, req);
            _this._execution_promises.push(exec_promise);
            res.status(200);
            res.json(true);

            // Silently catch and log execution errors
            exec_promise.catch(function(error) {
               console.error(error.toString());  // eslint-disable-line no-console
            });
        }, function(factory_error) {
            res.status(401);
            res.json(ErrorHelper('Cannot execute query', factory_error));
        });
    }
};

/**
 * @fn getQueryStatusById
 * @desc Retrieves the current execution status for a specific query
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExecutionController.prototype.getQueryStatusById = function(req, res) {
    let query_id = req.params.query_id;
    if (query_id === undefined || query_id === null) {
        res.status(401);
        res.json(ErrorHelper('Missing query_id'));
        return;
    }
    this.queryFactory.fromID(query_id).then(function(queryObject) {
        res.status(200);
        res.json(queryObject.getModel().status);
    }, function (error) {
       res.status(401);
       res.json(ErrorHelper('Get query execution status failed', error));
    });
};

/**
 * @fn _internalExecutor
 * @param queryObject {QueryAbstract} Executes a query from its abstract representation
 * @param request Express.js request object received to trigger execution
 * @return {Promise} Resolve to true after all the execution succeeded or rejects an error stack
 * @private
 */
ExecutionController.prototype._internalExecutor = function(queryObject, request) {
    return new Promise(function(resolve, reject) {
        let error_callback = function(error_object) {
            queryObject.updateExecutionStatus({
                end: new Date(),
                info: JSON.stringify(error_object),
                status: Constants.BL_QUERY_STATUS_ERROR
            });
            reject(ErrorHelper('Execution failed', error_object));
        };

        let init_staqe = [
            queryObject.updateExecutionStatus({
                start: new Date(),
                info: 'Preparing..',
                status: Constants.BL_QUERY_STATUS_INITIALIZE
            }),
            queryObject.initialize(request)
        ];

        Promise.all(init_staqe).then(function() {
            let exec_stage = [
                queryObject.updateExecutionStatus({
                    stage: new Date(),
                    info: 'Running..',
                    status: Constants.BL_QUERY_STATUS_EXECUTE
                }),
                queryObject.execute()
            ];
            Promise.all(exec_stage).then(function() {
                let terminate_stage = [
                    queryObject.updateExecutionStatus({
                        stage: new Date(),
                        info: 'Finishing..',
                        status: Constants.BL_QUERY_STATUS_TERMINATE
                    }),
                    queryObject.terminate()
                ];
                Promise.all(terminate_stage).then(function() {
                    queryObject.updateExecutionStatus({
                        end: new Date(),
                        info: 'Youpi !',
                        status: Constants.BL_QUERY_STATUS_DONE
                    }).then(function() {
                        resolve(true);
                    }, error_callback);
                }, error_callback);
           }, error_callback);
        }, error_callback);
    });
};

module.exports = ExecutionController;
