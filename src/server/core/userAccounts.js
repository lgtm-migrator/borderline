const path = require('path');
const fs = require('fs-extra');
const https = require('https');

class UserAccounts {
    constructor() {
        this.users = [];
    }

    findByUsernameAndPassword(username, password) {
        return new Promise(function(resolve) {
            resolve({id: 42, admin: true}); //Fetch local DB here
        });
    }

    findById(id) {
        return new Promise(function(resolve) {
           resolve({id: 42, admin: true});
        });
    }

    registerExternalByUsernameAndPassword(username, password) {
        return new Promise(function(resolve) {
            resolve(null); //Fetch default external DB here
        });
    }

    updateById(id, data) {
        return new Promise(function(resolve) {
            resolve(false);
        });
    }

    deleteById(id) {
        return new Promise(function(resolve) {
            resolve(false);
        });
    }

}

module.exports = UserAccounts;
