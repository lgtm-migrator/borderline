const path = require('path');
const fs = require('fs-extra');
const https = require('https');
const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;

function UserAccounts(userCollection) {
    this.userCollection = userCollection;

    this.findAll = UserAccounts.prototype.findAll.bind(this);
    this.findByUsernameAndPassword = UserAccounts.prototype.findByUsernameAndPassword.bind(this);
    this.registerExternalByUsernameAndPassword = UserAccounts.prototype.registerExternalByUsernameAndPassword.bind(this);
    this.findById = UserAccounts.prototype.findById.bind(this);
    this.updateById = UserAccounts.prototype.updateById.bind(this);
    this.deleteById = UserAccounts.prototype.deleteById.bind(this);
}

UserAccounts.prototype.findAll = function(){
    var that = this;
    return  new Promise(function(resolve, reject) {
        that.userCollection.find().toArray().then(function(result) {
            if (result === null || result === undefined)
                reject('No users ?!');
            else
                resolve(result);
        }, function(error) {
            reject(error.toString());
        });
    });
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
        //reject('Invalid username/password first time login');

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
    var that = this;
    return new Promise(function(resolve, reject) {
        that.userCollection.findOne({ _id : new ObjectID(id) }).then(function(result) {
            if (result === null || result === undefined)
                reject('No match for id: ' + id);
            else
                resolve(result);
        },
        function (error) {
            reject(error);
        });
    });
};

UserAccounts.prototype.updateById = function(id, data) {
    var that = this;
    return new Promise(function(resolve, reject) {
        if (data.hasOwnProperty('_id')) //Transforms ID to mongo ObjectID type
            delete data._id;
        that.userCollection.findOneAndReplace({ _id : new ObjectID(id) }, data).then(function(result) {
                if (result === null || result === undefined)
                    reject('No match for id: ' + id);
                else
                    resolve(result);
            },
            function (error) {
                reject(error);
            });
    });
};

UserAccounts.prototype.deleteById = function(id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.userCollection.findOneAndDelete({ _id : new ObjectID(id) }).then(function(result) {
            resolve(result);
        }, function (error) {
            reject(error);
        });
    });
};


module.exports = UserAccounts;
