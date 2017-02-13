const fs = require('fs-extra');
const path = require('path');

function PluginFileSystem(pluginUuid) {
    this.uuid = pluginUuid;
    this.root = path.join(global.config.pluginFileSystemFolder, pluginUuid);
    this._bootstrap();
}

PluginFileSystem.prototype._bootstrap = function() {
    var paths = this.root.split(path.sep);
    var p = '/';
    for (var i = 1; i < paths.length; i++) {
        p = path.join(p, paths[i]);
        if (fs.existsSync(p) === false) {
            fs.mkdirSync(p);
        }
    }
};

PluginFileSystem.prototype._isValidPath = function(filePath) {
    var relativeFilePath = path.relative(this.root, filePath);

    //Checking user is not trying to go outside it's root filesystem
    if (relativeFilePath.indexOf('..') !== -1)
        return false;
    return true;
};

PluginFileSystem.prototype.close = function(fd) {
    try {
        fs.close(fd);
    }
    catch (err) {
        console.error(err);
        return false;
    }
    return true;
};

PluginFileSystem.prototype.exists = function(path) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return false;
    return fs.existsSync(filePath);
};

PluginFileSystem.prototype.mkdir = function(path) {
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

PluginFileSystem.prototype.open = function(path, flags) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return -1;
    return fs.openSync(filePath, flags);
};

PluginFileSystem.prototype.read = function(fd, buf, count) {
    return fs.readSync(fd, buf, 0, count, null) ;
};

PluginFileSystem.prototype.readFile = function(filePath) {
    var filePath = path.join(this.root, filePath);
    if (this._isValidPath(filePath) === false)
        return null;
    return fs.readFileSync(filePath);
};

PluginFileSystem.prototype.rename = function(oldPath, newPath) {
    var oldFilePath = path.join(this.root, oldPath);
    var newFilePath = path.join(this.root, newPath);
    if (this._isValidPath(oldFilePath) === false)
        return false;
    if (this._isValidPath(newFilePath) === false)
        return false;
    fs.renameSync(oldFilePath, newFilePath);
    return true;
};

PluginFileSystem.prototype.rmdir = function(path) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return false;
    fs.rmdir(filePath);
    return true;
};

PluginFileSystem.prototype.write = function(fd, buf, count) {
    return fs.writeSync(fd, buf, 0, count, null);
};

PluginFileSystem.prototype.writeFile = function(path, buf) {
    var filePath = path.join(this.root, path);
    if (this._isValidPath(filePath) === false)
        return null;
    return fs.writeFileSync(filePath, buf);
};

module.exports = PluginFileSystem;
