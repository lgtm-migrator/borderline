const fs = require('fs-extra');
const path = require('path');

/**
 * @fn ExtensionFileSystem
 * @param extensionUuid Extension unique identifier, used to define the scope
 * @constructor
 */
function ExtensionFileSystem(extensionUuid) {
    this.uuid = extensionUuid;
    this.root = path.join(global.config.extensionFileSystemFolder, extensionUuid);
    this._bootstrap();
}

/**
 * @fn _bootstrap
 * @desc Private member called in constructor. Makes sure the root folder exists
 * @private
 */
ExtensionFileSystem.prototype._bootstrap = function() {
    if (fs.existsSync(this.root) === false) {
        fs.mkdirSync(this.root);
    }
};

/**
 * @fn _isValidPath
 * @desc Check if a given path is inside the filesystem scope
 * @param filePath A string path to check
 * @return {boolean} True if the path is within the filesystem scope
 * @private
 */
ExtensionFileSystem.prototype._isValidPath = function(filePath) {
    var relativeFilePath = path.relative(this.root, filePath);

    //Checking user is not trying to go outside it's root filesystem
    if (relativeFilePath.indexOf('..') !== -1)
        return false;
    return true;
};

/**
 * @fn close
 * @param fd File descriptor Object
 * @return {boolean} Operation status
 */
ExtensionFileSystem.prototype.close = function(fd) {
    try {
        fs.close(fd);
    }
    catch (err) {
        console.error(err);
        return false;
    }
    return true;
};

/**
 * @fn exists
 * @param path Path string to check
 * @return {boolean}
 */
ExtensionFileSystem.prototype.exists = function(path) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return false;
    return fs.existsSync(filePath);
};

/**
 * @fn mkdir
 * @desc Create a directory
 * @param path String path to the directory
 * @return {boolean}
 */
ExtensionFileSystem.prototype.mkdir = function(path) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return false;

    try {
        fs.mkdirpSync(filePath);
    }
    catch (err) {
        console.error(err);
        return false;
    }
    return true;
};

/**
 * @fn open
 * @param path String path to the file to open
 * @param flags Open mode permissions string, like read/write/exectute
 * @return {number} The opened file descriptor
 */
ExtensionFileSystem.prototype.open = function(path, flags) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return -1;
    return fs.openSync(filePath, flags);
};

/**
 * @fn read
 * @param fd File descriptor
 * @param buf Buffer to read to
 * @param count Size of the read to perform
 * @return {number} Number of bytes read
 */
ExtensionFileSystem.prototype.read = function(fd, buf, count) {
    return fs.readSync(fd, buf, 0, count, null) ;
};

/**
 * @fn readFile
 * @param filePath String path to the file
 * @return {String} The whole file content
 */
ExtensionFileSystem.prototype.readFile = function(filePath) {
    var filePath = path.join(this.root, filePath);
    if (this._isValidPath(filePath) === false)
        return null;
    return fs.readFileSync(filePath);
};

/**
 * @fn rename
 * @param oldPath Source file path
 * @param newPath New file path
 * @return {boolean}
 */
ExtensionFileSystem.prototype.rename = function(oldPath, newPath) {
    var oldFilePath = path.join(this.root, oldPath);
    var newFilePath = path.join(this.root, newPath);
    if (this._isValidPath(oldFilePath) === false)
        return false;
    if (this._isValidPath(newFilePath) === false)
        return false;
    fs.renameSync(oldFilePath, newFilePath);
    return true;
};

/**
 * @fn rmdir
 * @desc man 2 rmdir
 * @param path Path to the directory to remove
 * @return {boolean}
 */
ExtensionFileSystem.prototype.rmdir = function(path) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return false;
    fs.rmdir(filePath);
    return true;
};

/**
 * @fn write
 * @param fd File descriptor number
 * @param buf Buffer towrite in the file
 * @param count Number of bytes to write
 * @return {number} Number of written bytes
 */
ExtensionFileSystem.prototype.write = function(fd, buf, count) {
    return fs.writeSync(fd, buf, 0, count, null);
};

/**
 * @fn writeFile
 * @param path path to the file to write
 * @param buf Buffer to write in th efile
 * @return {number} Number of written bytes
 */
ExtensionFileSystem.prototype.writeFile = function(path, buf) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return null;
    return fs.writeFileSync(filePath, buf);
};

module.exports = ExtensionFileSystem;
