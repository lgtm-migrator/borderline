const defines = require('../defines.js');

function ObjectStorage(queryGridFS) {
    this.gridfs = queryGridFS;

    //Bind member functions
    this.createObject = ObjectStorage.prototype.createObject.bind(this);
    this.getObject = ObjectStorage.prototype.getObject.bind(this);
    this.setObject = ObjectStorage.prototype.setObject.bind(this);
    this.deleteObject = ObjectStorage.prototype.deleteObject.bind(this);

    //Private methods
}

ObjectStorage.prototype.createObject = function(object_data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
       try {
           throw "Not implemented";
       }
       catch (error) {
           reject({error: error.toString() });
       }
    });
};

ObjectStorage.prototype.getObject = function(object_id) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            throw "Not implemented";
        }
        catch (error) {
            reject({error: error.toString() });
        }
    });
};

ObjectStorage.prototype.setObject = function(object_id, object_data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            throw "Not implemented";
        }
        catch (error) {
            reject({error: error.toString() });
        }
    });
};

ObjectStorage.prototype.deleteObject = function(object_id) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            throw "Not implemented";
        }
        catch (error) {
            reject({error: error.toString() });
        }
    });
};

module.exports = ObjectStorage;
