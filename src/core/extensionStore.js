//External modules
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const adm_zip = require('adm-zip');

//Local modules
let Extension = require('./extension/extension');
const defines = require('../defines.js');

/**
 * @fn ExtensionStore
 * @param extensionCollection MongoDB collection to sync against
 * @constructor
 */
let ExtensionStore = function(extensionCollection, gridFSObjectStorage) {
    this.extensions = [];
    this.extensionFolder = path.normalize(global.config.extensionSourcesFolder);
    this.extensionCollection = extensionCollection;
    this.gridFSObjectStorage = gridFSObjectStorage;
    this.router = express.Router();

    //Look what's in the local folder
    this._scanLocalFolder();
    if (global.config.development === true) {
        this._watchLocalFolder(); //Keep updating that
    }
    this._scanDatabase(); //Sync with the DB
};

/**
 * @fn _scanDatabase
 * @desc Synchronise current extension list with what's inside the DB
 * and disables missing extensions
 * @private
 */
ExtensionStore.prototype._scanDatabase = function() {
    let that = this;
    this.extensionCollection.find().toArray().then(function(results) {
        for (let i = 0; i < results.length; i++) {
            if (that._findExtensionById(results[i]._id) === null) {
                that._syncExtension({ uuid: results[i]._id }, 'disable');
            }
        }
    });
};

/**
 * @_syncExtension
 * @param extension JS object to represent an extension
 * @param operation String describing which operation to perform
 * @return {Promise} Resolve to the update model on success
 * @private
 */
ExtensionStore.prototype._syncExtension = function(extension, operation) {
    let that = this;
    let model = null;
    operation =  typeof operation !== 'undefined' ? operation : 'update';
    if (operation === 'create' || operation === 'update') {
        let info = JSON.parse(JSON.stringify(extension.manifest));
        delete info['server.js'];
        delete info['client.js'];
        delete info['id'];
        model = Object.assign({}, defines.extensionModel, {
            users: extension.users ? extension.users : [],
            enabled: true
        }, info);
    }

    return new Promise(function(resolve, reject) {
        let sync_success = function(success) { resolve(success); };
        let sync_error = function(error) { reject(defines.errorStacker('Extension synchronise failed', error)); };

        if (operation === 'update' || operation === 'create') {
            that.extensionCollection.findOneAndReplace({_id: extension.uuid}, model, { upsert: true })
                .then(sync_success, sync_error);
        }
        else if (operation === 'disable') {
            that.extensionCollection.findOneAndUpdate({ _id: extension.uuid }, { $set: { enabled: false } })
                .then(sync_success, sync_error);
        }
        else if (operation === 'enable') {
            that.extensionCollection.findOneAndUpdate({ _id: extension.uuid }, { $set: { enabled: true } })
                .then(sync_success, sync_error);
        }
        else if (operation === 'delete') {
            that.extensionCollection.findOneAndDelete({ _id: extension.uuid })
                .then(sync_success, sync_error);
        }
        else {
            reject('Undefined extension sync operation: ' + operation);
        }
    });
};

/**
 * @fn _attachExtension
 * @desc Plugs in the extension endpoint to the extensions global router
 * @param extension Instance of a extension object initialized
 * @private
 */
ExtensionStore.prototype._attachExtension = function(extension) {
    extension.attach();
    this.router.use('/' + extension.uuid, extension.router);
};

/**
 * @fn _detachExtension
 * @esc Removes an extension from the router
 * @param extension Instance of a extension object
 * @return {boolean} Success status
 * @private
 */
ExtensionStore.prototype._detachExtension = function(extension) {
    extension.detach();
    if (Array.isArray(this.router.stack)) {
        let extensionRoot = '/' + extension.uuid;
        let index = this.router.stack.findIndex(function (layer) {
            if (layer.name === 'router' && extensionRoot.match(layer.regexp)) {
                return true;
            }
        });
        if (index !== -1) {
            this.router.stack.splice(index, 1);
            return true;
        }
    }
    return false;
};

/**
 * @fn _findExtensionByID
 * @desc Find an extension from its ID
 * @param id Unique identifier string
 * @private
 */
ExtensionStore.prototype._findExtensionById = function(id) {
    for (let i = 0; i < this.extensions.length; i++) {
        if (this.extensions[i].uuid === id)
            return this.extensions[i];
    }
    return null;
};

/**
 * @fn _watchLocalFolder
 * @desc Listen for filesystem changes to update extensions list
 * @private
 */
ExtensionStore.prototype._watchLocalFolder = function() {
    let that = this;
    fs.watch(this.extensionFolder,
        {
            recursive: true,
            encoding: 'utf8',
            persistent: true
        },
        function(__unused__eventType, filename)
        {
            try {
                if (!filename)
                    return;
                let re = /([\/\\])/;
                let extensionDirectory = filename.split(re);
                if (extensionDirectory && extensionDirectory.length > 0) {
                    let folder = extensionDirectory[0];
                    let extensionPath = path.join(that.extensionFolder, folder);
                    let manifest = fs.readJsonSync(path.join(extensionPath, 'plugin.json'));
                    let p = that._findExtensionById(manifest.id);
                    if (p !== null) {
                        that._detachExtension(p);
                        that.extensions.splice(that.extensions.findIndex(function (p) {
                            return p.uuid === manifest.id;
                        }), 1);
                        if (fs.existsSync(extensionPath)) {
                            let new_extension = new Extension(extensionPath, that.gridFSObjectStorage);
                            that._attachExtension(new_extension);
                            that.extensions.push(new_extension);
                            that._syncExtension(new_extension, 'update');
                        }
                    }
                    else {
                        if (fs.existsSync(extensionPath)) {
                            let new_extension = new Extension(extensionPath, that.gridFSObjectStorage);
                            that._attachExtension(new_extension);
                            that.extensions.push(new_extension);
                            that._syncExtension(new_extension, 'create');
                        }
                    }
                }
            }
            catch (err) {
                console.error('Error updating in development: ' + err); // eslint-disable-line no-console
            }
        }
    );
};

/**
 * @fn _scanLocalFolder
 * @desc List files in extension folder, instanciate & initialize them
 * @private
 */
ExtensionStore.prototype._scanLocalFolder = function() {
    let dir_content = fs.readdirSync(this.extensionFolder);
    let that = this;

    dir_content.forEach(function(f) {
        let file = path.join(that.extensionFolder, f);
        let file_fd = fs.openSync(file, 'r');
        let file_stats = fs.fstatSync(file_fd);
        if (file_stats.isDirectory()) {
            let extension = new Extension(file, that.gridFSObjectStorage);
            that._attachExtension(extension);
            that.extensions.push(extension);
            that._syncExtension(extension, 'update');
        }
    });
};

/**
 * @fn listExtensions
 * @desc Returns active extension list metadata
 * @return {Array} Known extensions
 */
ExtensionStore.prototype.listExtensions = function() {
    let list = [];
    for (let i = 0; i < this.extensions.length; i++) {
        list.push(this.extensions[i].info());
    }
    return list;
};

/**
 * @fn createExtensionFromFile
 * @param file Raw zip file
 * @return {Object} Created extension metadata
 */
ExtensionStore.prototype.createExtensionFromFile = function(file) {
    let that = this;
    let buf = Buffer.from(file.buffer);
    let zip = new adm_zip(buf);

    //Find required manifest file
    let manifest = null;
    zip.getEntries().forEach(function (entry) {
        if (entry.name === 'plugin.json')
            manifest = entry;
    });

    if (manifest === null) {
        return defines.errorStacker('Missing mandatory extension manifest plugin.js');
    }
    manifest = JSON.parse(manifest.getData());
    if (manifest === null || manifest.hasOwnProperty('id') === false) {
        return defines.errorStacker('Corrupted extension manifest plugin.js');
    }

    //Generate a non-colliding extension UUID
    while (that._findExtensionById(manifest.id) !== null)
        manifest.id = Math.floor(Math.random() * 0xffffffffffff).toString(16);

    zip.extractAllTo(that.extensionFolder, true);

    let packageFolder = path.join(that.extensionFolder, manifest.name + '-' + manifest.version);

    //overwrite manifest ofter extraction for non colliding ids
    fs.writeJsonSync(path.join(packageFolder, './plugin.json'), manifest);

    let new_extension = new Extension(packageFolder, that.gridFSObjectStorage);
    that.extensions.push(new_extension);
    that._attachExtension(new_extension);

    return {id: manifest.id};
};

/**
 * @fn clearExtensions
 * @desc removes every extensions from both router and DB
 */
ExtensionStore.prototype.clearExtensions = function() {
    let that = this;
    this.extensions.forEach(function(extension) {
        //Disconnect routes
        that._detachExtension(extension);
        //Remove local directory
        fs.removeSync(path.join(that.extensionFolder, './' + extension.manifest.name + '-' + extension.manifest.version));
        //Remove from DB
        that._syncExtension(extension, 'delete');
    });
    this.extensions = [];
};

/**
 * @fn getExtensionInfoByID
 * @param id Extension unique identifier
 * @return {Object} Extension info object
 */
ExtensionStore.prototype.getExtensionInfoById = function(id) {
    let  p = this._findExtensionById(id);
    if (p !== null)
        return p.infos();
    return null;
};

/**
 * @fn deleteExtensionByID
 * @param uuid Extension unique identifier to delete
 * @return {Object} Operation summary object
 */
ExtensionStore.prototype.deleteExtensionById = function(uuid) {
    let res = { error: 'Cannot delete extension with ID ' + uuid };

    let p = this._findExtensionById(uuid);
    if (p !== null) {
        if (this._detachExtension(p) === true) {
            //Remove from DB
            this._syncExtension(p, 'delete');
            //Remove from array
            this.extensions.splice(this.extensions.findIndex(function(p) { return p.uuid === uuid; }), 1);
            //Remove local directory
            fs.removeSync(this.extensionFolder + '/' + uuid);
            res = {id: uuid};
        }
        else {
            res = { error: 'Detaching the extension failed. ID ' + uuid };
        }
    }
    return res;
};

/**
 * @fn updateExtensionByID
 * @param uuid extension reference ID to update
 * @param file Extension content in .zip format
 * @return {Object} Operation summary object
 */
ExtensionStore.prototype.updateExtensionById = function(uuid, file) {
    let buf = Buffer.from(file.buffer);
    let zip = new adm_zip(buf);
    let zipEntries = zip.getEntries(); // an array of ZipEntry records
    let manifest = null;

    zipEntries.forEach(function(zipEntry) {
        if (zipEntry.name === 'plugin.json') {
            manifest = zipEntry.entryName; //Stores manifest path within zip
        }
    });

    if (manifest === null) {
        return defines.errorStacker('Missing mandatory extension manifest plugin.json');
    }

    let delReply = this.deleteExtensionById(uuid);
    if (delReply.hasOwnProperty('error')) {
        return defines.errorStacker('Cannot update unknown extension ID: ' + uuid, delReply.error);
    }

    zip.extractAllTo(this.extensionFolder, true);

    manifest = fs.readJSONSync(path.join(this.extensionFolder, manifest));
    if (manifest === null || manifest.hasOwnProperty('id') === false) {
        return defines.errorStacker('Corrupted extension manifest plugin.json');
    }
    let packageFolder = path.join(this.extensionFolder, manifest.name + '-' + manifest.version);

    let new_extension = new Extension(packageFolder, this.gridFSObjectStorage);
    //Force extension uuid to match with the one used
    new_extension.uuid = uuid;
    this._attachExtension(new_extension);
    this.extensions.push(new_extension);
    //Insert in DB
    this._syncExtension(new_extension, 'create');

    return {id : uuid};
};


module.exports = ExtensionStore;
