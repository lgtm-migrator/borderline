const fs = require('fs-extra');
const path = require('path');

const userDataSourcesModule = require('../core/userDataSources');

var userDataSources = new userDataSourcesModule();

module.exports.getDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports.postDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports.deleteDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports.putDataSources = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports.getUserDataSource = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports.deleteUserDataSource = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports.postUserDataSource = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};

module.exports.putUserDataSource = function(req, res) {
    res.status(401);
    res.json({ error: 'Not implemented' });
};
