const fs = require('fs-extra');
const path = require('path');

const userDataSourcesModule = require('../core/userDataSources');

function UserDataSourcesController(dataSourcesCollection) {
    this.dataSourcesCollection = dataSourcesCollection;
    this.userDataSources = new userDataSourcesModule(dataSourcesCollection);

    this.getDataSources = UserDataSourcesController.prototype.getDataSources.bind(this);
    this.postDataSources = UserDataSourcesController.prototype.postDataSources.bind(this);
    this.deleteDataSources = UserDataSourcesController.prototype.deleteDataSources.bind(this);
    this.putDataSources = UserDataSourcesController.prototype.putDataSources.bind(this);
    this.getUserDataSource = UserDataSourcesController.prototype.getUserDataSource.bind(this);
    this.postUserDataSource = UserDataSourcesController.prototype.postUserDataSource.bind(this);
    this.deleteUserDataSource = UserDataSourcesController.prototype.deleteUserDataSource.bind(this);
}


UserDataSourcesController.prototype.getDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

UserDataSourcesController.prototype.postDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

UserDataSourcesController.prototype.deleteDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

UserDataSourcesController.prototype.putDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

UserDataSourcesController.prototype.getUserDataSource = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

UserDataSourcesController.prototype.postUserDataSource = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

UserDataSourcesController.prototype.deleteUserDataSource = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports = UserDataSourcesController;
