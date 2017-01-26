const path = require('path');
const fs = require('fs-extra');
const https = require('https');
const crypto = require('crypto');

function UserAccounts(userCollection) {
    this.users = [];
    this.userCollection = userCollection;

    this.findByUsernameAndPassword = UserAccounts.prototype.findByUsernameAndPassword.bind(this);
    this.registerExternalByUsernameAndPassword = UserAccounts.prototype.registerExternalByUsernameAndPassword.bind(this);
    this.findById = UserAccounts.prototype.findById.bind(this);
    this.updateById = UserAccounts.prototype.updateById.bind(this);
    this.deleteById = UserAccounts.prototype.deleteById.bind(this);
};

UserAccounts.prototype.findByUsernameAndPassword = function(username, password) {
    return new Promise(function(resolve) {
        resolve(null); //Fetch local DB here
    });
};

UserAccounts.prototype.registerExternalByUsernameAndPassword = function(username, password) {
    var that = this;

    return new Promise(function(resolve) {
        //Fetch default external DB here

        //Register new Borderline user on success
        var salt = crypto.randomBytes(32).toString('hex').slice(0, 32);
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        var hash_pass = hash.digest('hex');
        var new_user = {
            username: username,
            salt: salt,
            password: hash_pass,
            admin: false
        };

        //Resolve Promise on DB insert success
        that.userCollection.insertOne(new_user).then(function(result) {
            new_user._id = result.insertedId;
            resolve(new_user);
        });
    });
};

UserAccounts.prototype.findById = function(id) {
    return new Promise(function(resolve) {
        resolve({id: 42, admin: true});
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
