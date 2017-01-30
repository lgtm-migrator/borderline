const fs = require('fs-extra');
const path = require('path');
const ObjectID = require('mongodb').ObjectID;

function dataSources(dataSourcesCollection) {
    this.sourcesCollection = dataSourcesCollection;

    this.findAll = dataSources.prototype.findAll.bind(this);
}

dataSources.prototype.findAll = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.sourcesCollection.find().toArray().then(function(result) {
            if (result === null || result === undefined || result.length === 0)
                resolve([]);
            else
                resolve(result);
        }, function(error) {
            reject(error);
        });
    });
};

dataSources.prototype.createDataSource = function(data_source) {
    var that = this;
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < data_source.subscribers.length; i++) {
            data_source.subscribers[i] = new ObjectID(data_source.subscribers[i]);
        }
        that.sourcesCollection.insertOne(data_source).then(function(success) {
            if (success.insertedCount == 1) {
                resolve(success.ops[0]);
            }
            else {
                reject( { error: 'Did not manage to register a new data source' } );
            }
        }, function(error) {
            reject(error);
        });
    });
};

dataSources.prototype.getDataSourceByID = function(source_id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.sourcesCollection.findOne({_id: new ObjectID(source_id) }).then(function(result) {
            if (result === null || result === undefined)
                reject('No match for id: ' + source_id);
            else
                resolve(result);
        }, function(error) {
           reject(error);
        });
    });
};

dataSources.prototype.updateDataSourceByID = function(source_id, data) {
    var that = this;
    return new Promise(function(resolve, reject) {
        if (data.hasOwnProperty('_id')) //Transforms ID to mongo ObjectID type
            delete data._id;
        for (var i = 0; i < data.subscribers; i++) {
            data.subscribers[i] = new ObjectID(data.subscribers[i]);
        }
        that.sourcesCollection.findOneAndReplace({_id: new ObjectID(source_id) }, data).then(function(result) {
            if (result === null || result === undefined)
                reject('No match for id: ' + source_id);
            else {
                data._id = result.value._id;
                resolve(data);
            }
        }, function(error) {
            reject(error);
        });
    });
};


dataSources.prototype.deleteDataSourceByID = function(source_id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.sourcesCollection.findOneAndDelete({_id: new ObjectID(source_id)}).then(function (result) {
            resolve(result.value);
        }, function (error) {
            reject(error);
        });
    });
};


dataSources.prototype.getDataSourcesByUserID = function(user_id) {
    var that = this;
    return  new Promise(function(resolve, reject) {
        that.sourcesCollection.find({ subscribers: new ObjectID(user_id) }).toArray().then(function(result) {
            resolve(result);
        }, function(error) {
            reject(error);
        });
    });
};

dataSources.prototype.subscribeUserToDataSource = function(user_id, source_id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.sourcesCollection.updateOne({ _id: new ObjectID(source_id) },
                                         {
                                             $addToSet: {
                                                 subscribers: new ObjectID(user_id)
                                             }
                                         })
            .then(function(success) {
                if (success.matchedCount == 0) {
                    reject('Invalid user_id or source_id');
                    return;
                }
                if (success.modifiedCount == 0) {
                    reject('Already subscribed');
                    return;
                }
                resolve(success);
            }, function(error) {
                reject(error);
            }
            );
    });
};

dataSources.prototype.unsubscribeUserFromDataSource = function(user_id, source_id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.sourcesCollection.updateOne({ _id: new ObjectID(source_id) },
            {
                $pull: {
                    subscribers: new ObjectID(user_id)
                }
            })
            .then(function(success) {
                if (success.matchedCount == 0) {
                    reject('Invalid user_id or source_id');
                    return;
                }
                if (success.modifiedCount == 0) {
                    reject('Already unsubscribed');
                    return;
                }
                resolve(success);
            }, function(error) {
                reject(error);
            });
    });
};

module.exports = dataSources;
