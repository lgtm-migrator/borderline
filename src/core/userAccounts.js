const path = require('path');
const fs = require('fs-extra');
const https = require('https');

var UserAccounts  =function() {
    this.users = [];
};

UserAccounts.prototype.findByUsernameAndPassword = function(username, password) {
    return new Promise(function(resolve) {
        resolve({id: 42, admin: true}); //Fetch local DB here
    });
};

UserAccounts.prototype.findById = function(id) {
    return new Promise(function(resolve) {
        resolve({id: 42, admin: true});
    });
};

UserAccounts.prototype.registerExternalByUsernameAndPassword = function(username, password) {
    return new Promise(function(resolve) {
        resolve(null); //Fetch default external DB here
    });
};

UserAccounts.prototype.updateById = function(id, data) {
    return new Promise(function(resolve) {
        resolve(false);
    });
};

UserAccounts.prototype.deleteById = function(id) {
    return new Promise(function(resolve) {
        resolve(false);
    });
};


module.exports = UserAccounts;
