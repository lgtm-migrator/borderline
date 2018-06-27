//External modules
const express = require('express');
const path = require('path');

//Local modules
let Extension = require('./extension');
const { ErrorHelper, Constants } = require('borderline-utils');

/**
 * @fn ExtensionStore
 * @param extensionCollection MongoDB collection to sync against
 * @constructor
 */
let ExtensionStore = function (extensionCollection) {
    // Init member vars
    this.extensions = {};
    this.extensionFolder = path.normalize(global.config.extensionSourcesFolder);
    this.extensionCollection = extensionCollection;
    this.router = express.Router();
    this._interval_timer = undefined;

    // Bind public member functions
    this.openStore = ExtensionStore.prototype.openStore.bind(this);
    this.closeStore = ExtensionStore.prototype.closeStore.bind(this);
    this.getExtensionById = ExtensionStore.prototype.getExtensionById.bind(this);

    // Bind private member functions
    this._attachExtension = ExtensionStore.prototype._attachExtension.bind(this);
    this._detachExtension = ExtensionStore.prototype._detachExtension.bind(this);
    this._scanDatabase = ExtensionStore.prototype._scanDatabase.bind(this);
    this._startExtensionUpdate = ExtensionStore.prototype._startExtensionUpdate.bind(this);
    this._stopExtensionUpdate = ExtensionStore.prototype._stopExtensionUpdate.bind(this);
};

/**
 * @fn openStore
 * @desc Setups & initialize the store
 * @return {Promise} Resolve to true if the store is ready, otherwise reject an error stack
 */
ExtensionStore.prototype.openStore = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        _this.router = express.Router();
        _this._scanDatabase().then(function (__unused__extensions) {
            if (global.config.extensionWatchFolder) {
                _this._startExtensionUpdate();
            }
            resolve(true);
        }, function (db_error) {
            reject(ErrorHelper('Fail to sync with DB', db_error));
        });
    });
};

/**
 * @fn closeStore
 * @desc Teardown the extension store service
 * @return {Promise} Resolve to true
 */
ExtensionStore.prototype.closeStore = function () {
    let _this = this;
    return new Promise(function (resolve, __unused__reject) {
        if (global.config.extensionWatchFolder) {
            _this._stopExtensionUpdate();
        }
        resolve(true);
    });
};

/**
 * @fn getExtensionById
 * @param extensionId {String} The id of the searched extension
 * @return {Promise} Resolve top the Extension object if found or rejects a error stack.
 */
ExtensionStore.prototype.getExtensionById = function (extensionId) {
    let _this = this;
    return new Promise(function (resolve, reject) {
        if (_this.extensions.hasOwnProperty(extensionId))
            resolve(_this.extensions[extensionId]);
        else
            reject(ErrorHelper('Cannot find extension [' + extensionId + ']'));
    });
};

/**
 * @fn _attachExtension
 * @desc Plugs in the extension endpoint to the extensions global router
 * @param extension {Extension} Instance of a extension object initialized
 * @private
 */
ExtensionStore.prototype._attachExtension = function (extension) {
    let _this = this;
    extension.enable().then(function () {
        _this.router.use('/' + extension.getId(), extension.getRouter());
    }, function (enable_error) {
        // This should not happen. We expect extension to be correctly generated.
        // If it does we will just silently leave the extension to disabled
        console.error(enable_error);  // eslint-disable-line no-console
    });
};

/**
 * @fn _detachExtension
 * @esc Removes an extension from the router
 * @param extension Instance of a extension object
 * @return {boolean} Success status
 * @private
 */
ExtensionStore.prototype._detachExtension = function (extension) {
    extension.disable().then(function () {
        return true;
    });
};

/**
 * @fn _scanDatabase
 * @desc Retrieves the list of extensions from the DB and update the model in db
 * If the extension was loaded from local folders it is enabled, otherwise its disabled
 * @return {Promise} Resolves to the number of extensions updated on success or rejects an error stack
 * @private
 */
ExtensionStore.prototype._scanDatabase = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let sync_promises = [Promise.resolve(true)];
        let i = 0;
        _this.extensionCollection.find().toArray().then(function (extension_models) {
            for (i = 0; i < extension_models.length; i++) {
                let ext_model = extension_models[i];
                let id = ext_model._id.toString();
                if (_this.extensions.hasOwnProperty(id) === false) {
                    _this.extensions[id] = new Extension(extension_models[i], _this.extensionCollection);
                    // Trigger file download here
                }
                sync_promises.push(_this.extensions[id].synchronise());
            }
            Promise.all(sync_promises).then(function (__unused__true_array) {
                resolve(i);
            }, function (sync_error) {
                reject(ErrorHelper('Update extensions from DB failed', sync_error));
            });
        }, function (find_error) {
            reject(ErrorHelper('Cannot list extension from DB', find_error));
        });
    });
};

ExtensionStore.prototype._startExtensionUpdate = function () {
    let _this = this;
    _this._interval_timer = setInterval(function () {
        _this._scanDatabase().then(function (__unused__updated_num) {
            // Nothing, silently success
            // console.info('Updated ' + __unused__updated_num + ' extensions');  // eslint-disable-line no-console
        }, function (err) {
            console.error(err.toString());  // eslint-disable-line no-console
        });
    }, Constants.BL_DEFAULT_EXTENSION_FREQUENCY); // Every seconds
};

ExtensionStore.prototype._stopExtensionUpdate = function () {
    let _this = this;
    clearInterval(_this._interval_timer);
    delete _this._interval_timer;
};

module.exports = ExtensionStore;
