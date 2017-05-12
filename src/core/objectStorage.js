const defines = require('../defines.js');
const uuid = require('uuid');

/**
 * @fn ObjectStoreage
 * @param queryGridFS GridFsBucket object to read/write objects into
 * @constructor
 */
function ObjectStorage(queryGridFS) {
    this.gridfs = queryGridFS;

    //Bind member functions
    this.createObject = ObjectStorage.prototype.createObject.bind(this);
    this.getObject = ObjectStorage.prototype.getObject.bind(this);
    this.setObject = ObjectStorage.prototype.setObject.bind(this);
    this.deleteObject = ObjectStorage.prototype.deleteObject.bind(this);

    //Private methods
    this._generateFilename = ObjectStorage.prototype._generateFilename.bind(this);
}

/**
 * @fn createObject
 * @param object_data String or Buffer data to store in a new object
 * @return {Promise} Resolves to object id on success
 */
ObjectStorage.prototype.createObject = function(object_data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
       try {
           //Create file in gridFS
           var writable = _this.gridfs.openUploadStream(_this._generateFilename());
           //Write data to file
           writable.write(object_data);
           writable.end();

           //Wait for operation to finish before resolving
           writable.on('finish', function() {
               resolve(writable.id);
           });
           //Handle errors
           writable.on('error', function (error) {
                reject(defines.errorStacker('Writable stream error', error));
           });
       }
       catch (error) {
           reject(defines.errorStacker('Creation caught exception', error));
       }
    });
};

/**
 * @fn getObject
 * @param object_id Reference identifier for the data
 * @return {Promise} Resolves to the data content into a String
 */
ObjectStorage.prototype.getObject = function(object_id) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            var data = '';
            //Open file in grid fs
            var readable = _this.gridfs.openDownloadStream(object_id);

            //Read data and accumulate to var data
            readable.on('data', function(chunk) {
                data += chunk;
            });
            //Reading done, resolve
            readable.on('end', function() {
                resolve(data);
            });
            //Handling errors
            readable.on('error', function (error) {
                reject (defines.errorStacker('Readable error', error));
            });
        }
        catch (error) {
            reject(defines.errorStacker(error));
        }
    });
};

/**
 * @fn setObject
 * @param object_id Reference identifier for the object to update
 * @param object_data New content for this data point
 * @return {Promise} Resolves to the object ID on success
 */
ObjectStorage.prototype.setObject = function(object_id, object_data) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            //First delete the old file content
            _this.gridfs.delete(object_id).then(function() {
                //Recreate file entry with same ID
                var writable = _this.gridfs.openUploadStreamWithId(object_id, _this._generateFilename());
                //Write data to file
                writable.write(object_data);
                writable.end();

                //Wait for operation to finish before resolving
                writable.on('finish', function() {
                    resolve(writable.id);
                });
                //Handle errors
                writable.on('error', function (error) {
                    reject(defines.errorStacker('Writable stream failed', error));
                });
            }, function (error) { //Delete failed
                reject(defines.errorStacker('Updating operation failed', error));
            })
        }
        catch (error) {
            reject(defines.errorStacker('Storage update caught error', error));
        }
    });
};

/**
 * @fn deleteObject
 * @param object_id Reference identifier to delete
 * @return {Promise} Resolve to the deleted object ID on success
 */
ObjectStorage.prototype.deleteObject = function(object_id) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        try {
            _this.gridfs.delete(object_id).then(function() {
                resolve(object_id);
            }, function (error) {
                reject(defines.errorStacker(error));
            });
        }
        catch (error) {
            reject(defines.errorStacker('Deleting storage caught error', error));
        }
    });
};

/**
 * @fn _generateFilename
 * @desc Wrapper around a name generator, internally based on RFC4122
 * @return {String} A random file name
 * @private
 */
ObjectStorage.prototype._generateFilename = function() {
    return uuid.v4();
};

module.exports = ObjectStorage;
