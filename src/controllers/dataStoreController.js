const fs = require('fs-extra');
const path = require('path');

const dataStoreModule = require('../core/dataStore');

function dataStoreController(mongoDBCollection) {
    this.sourcesCollection = mongoDBCollection;
    this.dataStore = new dataStoreModule(mongoDBCollection);

    this.getDataStore = dataStoreController.prototype.getDataStore.bind(this);
    this.postDataStore = dataStoreController.prototype.postDataStore.bind(this);
    this.getDataStoreByID = dataStoreController.prototype.getDataStoreByID.bind(this);
    this.putDataStoreByID = dataStoreController.prototype.putDataStoreByID.bind(this);
    this.deleteDataStoreByID = dataStoreController.prototype.deleteDataStoreByID.bind(this);
    this.getUserDataSources = dataStoreController.prototype.getUserDataSources.bind(this);
    this.postUserDataSourceByID = dataStoreController.prototype.postUserDataSourceByID.bind(this);
    this.deleteUserDataSourceByID = dataStoreController.prototype.deleteUserDataSourceByID.bind(this);
}


dataStoreController.prototype.getDataStore = function(req, res) {
    this.dataStore.findAll().then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Failed to list data sources: ' + error });
    });
};

dataStoreController.prototype.postDataStore = function(req, res) {
    var data_source = req.body;
    if (data_source === null || data_source === undefined) {
        res.status(401);
        res.json({ error: 'Cannot create an empty data source'});
        return;
    }
    this.dataStore.createDataStore(data_source).then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Failed to list data sources: ' + error });
    });
};

dataStoreController.prototype.getDataStoreByID = function(req, res) { //GET a single data source
    var source_id = req.params.source_id;
    this.dataStore.getDataStoreByID(source_id).then(function(result){
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot get data source by ID: ' + error });
    });
};
dataStoreController.prototype.putDataStoreByID = function(req, res) {  // PUT Update a single data source
    var source_id = req.params.source_id;
    var data = req.body;

    this.dataStore.updateDataStoreByID(source_id, data).then(function(result){
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot update data source by ID: ' + error });
    });
};
dataStoreController.prototype.deleteDataStoreByID = function(req, res) {
    var source_id = req.params.source_id;
    this.dataStore.deleteDataStoreByID(source_id).then(function(result){
        res.status(200);
        res.json({deleted: result});
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot delete data source by ID: ' + error });
    });
};
dataStoreController.prototype.getUserDataSources = function(req, res) {  //GET all user's data sources
    var user_id = req.params.user_id;
    this.dataStore.getdataStoreByUserID(user_id).then(function (result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot get user data sources: ' + error });
    });
};
dataStoreController.prototype.postUserDataSourceByID = function(req, res) { //POST Subscribe a user to a data source
    var user_id = req.params.user_id;
    var source_id = req.params.source_id;

    if (user_id === undefined || user_id === null || user_id === '') {
        res.status(501);
        res.json({ error: 'Missing user_id' });
        return;
    }

    if (source_id === undefined || source_id === null || source_id === '') {
        res.status(501);
        res.json({ error: 'Missing source_id' });
        return;
    }


    this.dataStore.subscribeUserToDataSource(user_id, source_id).then(function(success) {
        res.status(200);
        res.json(success);
    }, function(error) {
        res.status(401);
        res.json({error: 'Cannot subscribe: ' + error });
    });
};
dataStoreController.prototype.deleteUserDataSourceByID = function(req, res) { //DELETE Unsubscribe user to data source
    var user_id = req.params.user_id;
    var source_id = req.params.source_id;
    this.dataStore.unsubscribeUserFromDataSource(user_id, source_id).then(function(success) {
        res.status(200);
        res.json(success);
    }, function(error) {
        res.status(401);
        res.json({error: 'Cannot unsubscribe: ' + error });
    });
};

module.exports = dataStoreController;
