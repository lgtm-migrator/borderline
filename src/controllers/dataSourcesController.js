const fs = require('fs-extra');
const path = require('path');

const dataSourcesModule = require('../core/dataSources');

function dataSourcesController(mongoDBCollection) {
    this.sourcesCollection = mongoDBCollection;
    this.dataSources = new dataSourcesModule(mongoDBCollection);

    this.getDataSources = dataSourcesController.prototype.getDataSources.bind(this);
    this.postDataSource = dataSourcesController.prototype.postDataSource.bind(this);
    this.getDataSourceByID = dataSourcesController.prototype.getDataSourceByID.bind(this);
    this.putDataSourceByID = dataSourcesController.prototype.putDataSourceByID.bind(this);
    this.deleteDataSourceByID = dataSourcesController.prototype.deleteDataSourceByID.bind(this);
    this.getUserDataSources = dataSourcesController.prototype.getUserDataSources.bind(this);
    this.postUserDataSourceByID = dataSourcesController.prototype.postUserDataSourceByID.bind(this);
    this.deleteUserDataSourceByID = dataSourcesController.prototype.deleteUserDataSourceByID.bind(this);
}


dataSourcesController.prototype.getDataSources = function(req, res) {
    this.dataSources.findAll().then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Failed to list data sources: ' + error });
    });
};

dataSourcesController.prototype.postDataSource = function(req, res) {
    var data_source = req.body;
    if (data_source === null || data_source === undefined) {
        res.status(401);
        res.json({ error: 'Cannot create an empty data source'});
        return;
    }
    this.dataSources.createDataSource(data_source).then(function(result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Failed to list data sources: ' + error });
    });
};

dataSourcesController.prototype.getDataSourceByID = function(req, res) { //GET a single data source
    var source_id = req.params.source_id;
    this.dataSources.getDataSourceByID(source_id).then(function(result){
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot get data source by ID: ' + error });
    });
};
dataSourcesController.prototype.putDataSourceByID = function(req, res) {  // PUT Update a single data source
    var source_id = req.params.source_id;
    var data = req.body;

    this.dataSources.updateDataSourceByID(source_id, data).then(function(result){
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot update data source by ID: ' + error });
    });
};
dataSourcesController.prototype.deleteDataSourceByID = function(req, res) {
    var source_id = req.params.source_id;
    this.dataSources.deleteDataSourceByID(source_id).then(function(result){
        res.status(200);
        res.json({deleted: result});
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot delete data source by ID: ' + error });
    });
};
dataSourcesController.prototype.getUserDataSources = function(req, res) {  //GET all user's data sources
    var user_id = req.params.user_id;
    this.dataSources.getDataSourcesByUserID(user_id).then(function (result) {
        res.status(200);
        res.json(result);
    }, function(error) {
        res.status(401);
        res.json({ error: 'Cannot get user data sources: ' + error });
    });
};
dataSourcesController.prototype.postUserDataSourceByID = function(req, res) { //POST Subscribe a user to a data source
    var user_id = req.params.user_id;
    var source_id = req.params.source_id;
    this.dataSources.subscribeUserToDataSource(user_id, source_id).then(function(success) {
        res.status(200);
        res.json(success);
    }, function(error) {
        res.status(401);
        res.json({error: 'Cannot subscribe: ' + error });
    });
};
dataSourcesController.prototype.deleteUserDataSourceByID = function(req, res) { //DELETE Unsubscribe user to data source
    var user_id = req.params.user_id;
    var source_id = req.params.source_id;
    this.dataSources.unsubscribeUserFromDataSource(user_id, source_id).then(function(success) {
        res.status(200);
        res.json(success);
    }, function(error) {
        res.status(401);
        res.json({error: 'Cannot unsubscribe: ' + error });
    });
};

module.exports = dataSourcesController;
