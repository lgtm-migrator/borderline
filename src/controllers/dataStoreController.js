const dataStoreModule = require('../core/dataStore');
const { ErrorHelper } = require('borderline-utils');

/**
 * @fn dataStoreController
 * @param dataSourcesCollection Collection where the data sources information are stored
 */
function dataStoreController(dataSourcesCollection) {
    this.sourcesCollection = dataSourcesCollection;
    this.dataStore = new dataStoreModule(dataSourcesCollection);

    this.getDataStore = dataStoreController.prototype.getDataStore.bind(this);
    this.postDataStore = dataStoreController.prototype.postDataStore.bind(this);
    this.getDataStoreByID = dataStoreController.prototype.getDataStoreByID.bind(this);
    this.putDataStoreByID = dataStoreController.prototype.putDataStoreByID.bind(this);
    this.deleteDataStoreByID = dataStoreController.prototype.deleteDataStoreByID.bind(this);
    this.getUserDataSources = dataStoreController.prototype.getUserDataSources.bind(this);
    this.postUserDataSourceByID = dataStoreController.prototype.postUserDataSourceByID.bind(this);
    this.deleteUserDataSourceByID = dataStoreController.prototype.deleteUserDataSourceByID.bind(this);
}


/**
 * @fn getDataStore
 * @desc List all data source on this server
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.getDataStore = function(__unused__req, res) {
    this.dataStore.findAll().then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(500);
        res.json(ErrorHelper('Failed to list data sources', error));
    });
};


/**
 * @fn postDataStore
 * @desc Update the data sources on this server
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.postDataStore = function(req, res) {
    let data_source = req.body;
    if (data_source === null || data_source === undefined) {
        res.status(400);
        res.json(ErrorHelper('Cannot create an empty data source'));
        return;
    }
    this.dataStore.createDataSource(data_source).then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(500);
        res.json(ErrorHelper('Failed to list data sources', error));
    });
};


/**
 * @fn getDataStoreByID
 * @desc Find the data source referenced by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.getDataStoreByID = function(req, res) { //GET a single data source
    let source_id = req.params.source_id;
    this.dataStore.getDataSourceByID(source_id).then(function(result){
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(404);
        res.json(ErrorHelper('Cannot get data source by ID: ', error));
    });
};


/**
 * @fn putDataStoreByID
 * @desc Update a data source referenced by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.putDataStoreByID = function(req, res) {  // PUT Update a single data source
    let source_id = req.params.source_id;
    let data = req.body;

    this.dataStore.updateDataSourceByID(source_id, data).then(function(result){
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(400);
        res.json(ErrorHelper('Cannot update data source by ID', error));
    });
};


/**
 * @fn deleteDataStoreByID
 * @desc Removes a data soruce from the server. identified by its ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.deleteDataStoreByID = function(req, res) {
    let source_id = req.params.source_id;
    this.dataStore.deleteDataSourceByID(source_id).then(function(result){
        res.status(200);
        res.json({deleted: result});
    }, function(error) {
        res.status(404);
        res.json(ErrorHelper('Cannot delete data source by ID', error));
    });
};


/**
 * @fn getUserDataSources
 * @desc List all data source for a specific user
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.getUserDataSources = function(req, res) {  //GET all user's data sources
    let user_id = req.params.user_id;
    this.dataStore.getDataStoreByUserID(user_id).then(function (result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(404);
        res.json(ErrorHelper('Cannot get user data sources', error));
    });
};


/**
 * @fn postUserDataSourcesByID
 * @desc Subscribe a user to a data source.
 * Both are referenced by their IDs
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.postUserDataSourceByID = function(req, res) { //POST Subscribe a user to a data source
    let user_id = req.params.user_id;
    let source_id = req.params.source_id;

    if (user_id === undefined || user_id === null || user_id === '') {
        res.status(400);
        res.json(ErrorHelper('Missing user_id'));
        return;
    }
    if (source_id === undefined || source_id === null || source_id === '') {
        res.status(400);
        res.json(ErrorHelper('Missing source_id'));
        return;
    }
    let subscription = Object.assign({}, req.body, { user_id: user_id });

    this.dataStore.subscribeUserToDataSource(source_id, subscription).then(function(success) {
        res.status(200);
        res.json(success);
    }, function(error) {
        res.status(500);
        res.json(ErrorHelper('Cannot subscribe', error));
    });
};


/**
 * @fn deleteUserDataSourceByID
 * @desc Unsubscribe a user from a data source.
 * Both user and data source are referenced by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
dataStoreController.prototype.deleteUserDataSourceByID = function(req, res) { //DELETE Unsubscribe user to data source
    let user_id = req.params.user_id;
    let source_id = req.params.source_id;
    this.dataStore.unsubscribeUserFromDataSource(user_id, source_id).then(function(success) {
        res.status(200);
        res.json(success);
    }, function(error) {
        res.status(404);
        res.json(ErrorHelper('Cannot unsubscribe', error));
    });
};

module.exports = dataStoreController;
