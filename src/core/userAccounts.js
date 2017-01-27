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
    var that = this;
    return new Promise(function(resolve, reject) {
        that.userCollection.findOne({username: username}).then(function(result) {
            if (result === null || result === undefined) {
                reject('Invalid username/password');
                return;
            }
            var salt = result.salt || '';
            var hash = crypto.createHmac('sha512', salt);
            hash.update(password);
            var hash_pass = hash.digest('hex');
            if (hash_pass == result.password)
                resolve(result);
            else
                reject('Invalid username/password');
        },
        function(error) {
            reject(error.toString()); //Fetch local DB here
        });
    });
};

UserAccounts.prototype.registerExternalByUsernameAndPassword = function(username, password) {
    var that = this;

    return new Promise(function(resolve, reject) {
        //Fetch default external DB here
        reject('Invalid username/password first time login');

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
        }, function(error) {
            reject(error.toString());
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
