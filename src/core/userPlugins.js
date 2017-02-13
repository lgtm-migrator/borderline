const ObjectID = require('mongodb').ObjectID;

function UserPlugins(pluginCollection) {
    this.pluginCollection = pluginCollection;

    this.listPlugins = UserPlugins.prototype.listPlugins.bind(this);
    this.clearPlugins = UserPlugins.prototype.clearPlugins.bind(this);
    this.subscribe = UserPlugins.prototype.subscribe.bind(this);
    this.unsubscribe = UserPlugins.prototype.unsubscribe.bind(this);
}

UserPlugins.prototype.listPlugins = function(user_id) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.pluginCollection.find({ user: [ new ObjectID(user_id) ] }).toArray().then(
            function (result) {
                resolve(result);
            },
            function (error) {
                reject('List error: ' + error.toString());
            }
        );
    });
};

UserPlugins.prototype.clearPlugins = function(user_id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.pluginCollection.updateMany(
            { _id: new ObjectID(user_id) },
            {
                $pull: {
                    users: new ObjectID(user_id)
                }
            })
            .then(
                function(success) {
                    resolve(success);
                },
                function(error) {
                    reject('Clear plugins subs error: ' + error.toString());
                }
            );
    });
};

UserPlugins.prototype.subscribe = function(user_id, plugin_id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.pluginCollection.updateOne(
            { _id: plugin_id },
            {
                $addToSet: {
                    users: new ObjectID(user_id)
                }
            })
            .then(
                function(success) {
                    if (success.matchedCount == 0) {
                        reject('Invalid user_id or plugin_id');
                        return;
                    }
                    if (success.modifiedCount == 0) {
                        reject('Already subscribed');
                        return;
                    }
                    resolve(success);
                },
                function(error) {
                    reject('Plugin subscribe error: ' + error.toString());
                }
            );
    });
};


UserPlugins.prototype.unsubscribe = function(user_id, plugin_id) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.pluginCollection.updateOne(
            { _id: plugin_id },
            {
                $pull: {
                    users: new ObjectID(user_id)
                }
            })
            .then(
                function(success) {
                    if (success.matchedCount == 0) {
                        reject('Invalid user_id or plugin_id');
                        return;
                    }
                    if (success.modifiedCount == 0) {
                        reject('Already subscribed');
                        return;
                    }
                    resolve(success);
                },
                function(error) {
                    reject('Plugin subscribe error: ' + error.toString());
                }
            );
    });
};

module.exports = UserPlugins;
