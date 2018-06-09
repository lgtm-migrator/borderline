const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const ObjectID = require('mongodb').ObjectID;
const { ErrorHelper, Models, Constants, RegistryIdentifier } = require('borderline-utils');

/**
 * @fn Extension
 * @desc This class represents a borderline extension
 * @param ExtensionModel {Object} Absolute path to the root folder on the filesystem
 * @param ExtensionCollection MongoDB extension collection, updates happen here
 * @constructor
 */
function Extension(ExtensionModel, ExtensionCollection) {
    let _this = this;

    // Init member vars
    let enable_data = { enabled: {} };
    enable_data.enabled[RegistryIdentifier()] = true;
    this._model = Object.assign({}, Models.BL_MODEL_EXTENSION, ExtensionModel, enable_data);
    this._extensionCollection = ExtensionCollection;
    this._router = express.Router();
    this._static_router = express.Router();

    // Bind private member functions
    this._readManifest = Extension.prototype._readManifest.bind(this);

    // Bind public member functions
    this.getId = Extension.prototype.getId.bind(this);
    this.getModel = Extension.prototype.getModel.bind(this);
    this.setModel = Extension.prototype.setModel.bind(this);
    this.getRouter = Extension.prototype.getRouter.bind(this);
    this.enable = Extension.prototype.enable.bind(this);
    this.disable = Extension.prototype.disable.bind(this);
    this.synchronise = Extension.prototype.synchronise.bind(this);

    // Init the router logic
    this._router.use(function (req, res, next) {
        if (_this._model.enabled === true) {
            _this._static_router(req, res, next);
        }
        else {
            res.status(404);
            res.json(ErrorHelper('Extension is disabled'));
        }
    });
}

/**
 * @fn _readManifest
 * @desc Reads a manifest json file for this extension.
 * The computed path will always be /server_extension_directory/{extension_id}/extensionManifestFilename
 * @return {Promise} Resolve to the manifest_content on success, or reject an error stack on error
 * @private
 */
Extension.prototype._readManifest = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let manifest_path = path.join(global.config.extensionSourcesFolder, _this.getId());
        manifest_path = path.format({ dir: path.normalize(manifest_path), base: Constants.BL_DEFAULT_EXTENSION_MANIFEST });
        fs.readJson(manifest_path).then(function (manifest_data) {
            resolve(manifest_data);
        }, function (error) {
            reject(ErrorHelper('Reading extension manifest failed', error));
        });
    });
};

/**
 * @fn getId
 * @desc Getter for the extension unique identifier
 * @return A string containing the extension unique identifier, or null if none
 */
Extension.prototype.getId = function () {
    if (this._model && this._model._id) {
        if (this._model._id instanceof ObjectID)
            return this._model._id.toHexString();
        else
            return this._model._id;
    }
    return null;
};

/**
 * @fn getModel
 * @desc Retrieves this extension model plain JS object
 * @return JSON object content
 */
Extension.prototype.getModel = function () {
    return this._model;
};

/**
 * @fn setModel
 * @desc Updates the model properties.
 * @param[in] mergeModel All of this object properties will be copy merged to the internal model
 * @return {Boolean} Always true
 */
Extension.prototype.setModel = function (mergeModel) {
    this._model = Object.assign({}, this._model, mergeModel);
    return true;
};

/**
 * @fn getRouter
 * @desc Getter on this extension file router
 * @return {Promise} Always resolves to Express.js router type
 */
Extension.prototype.getRouter = function () {
    return Promise.resolve(this._router);
};

/**
 * @fn enable
 * @desc Try to enable this extension. On success, all the extensions files will be served by this extension router.
 * @return {Promise} Resolve to the extension manifest on success, reject an error stack otherwise.
 */
Extension.prototype.enable = function () {
    let _this = this;

    return new Promise(function (resolve, __unused__reject) {
        _this._static_router = express.Router();
        // Serves all the files as static
        _this._static_router.get('/*', function (req, res) {
            let uri = req.params[0];
            if (uri === null || uri === undefined || uri.length === 0)
                uri = 'app.js'; // Defaults to app.js

            let resourcePath = path.join(global.config.extensionSourcesFolder, _this.getId(), uri);
            if (fs.existsSync(resourcePath) === true) {
                res.status(200);
                return res.sendFile(resourcePath);
            }
            res.status(404);
            res.json({ error: 'Unresolved extension resource /' + uri });
        });

        // Makes sure _model.enabled = true, even if _model is undefined
        let enable_data = { enabled: {} };
        enable_data.enabled[RegistryIdentifier()] = true;
        _this._model = Object.assign({}, _this._model, enable_data);
        resolve(_this._model);
    });
};

/**
 * @fn disable
 * @desc Disables this extension. The files will no longer be served and the model enabled = false
 * @return {Promise} Always resolve to true
 */
Extension.prototype.disable = function () {
    let _this = this;

    _this._static_router = express.Router();
    // Makes sure _model.enabled = false, even if _model is undefined
    let enable_data = { enabled: {} };
    enable_data.enabled[RegistryIdentifier()] = false;
    _this._model = Object.assign({}, _this._model, enable_data);
    return Promise.resolve(true);
};

/**
 * @fn synchronise
 * @desc
 * @return {Promise}
 */
Extension.prototype.synchronise = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
        let mongo_id = _this._model._id;

        let mongo_find = function () {
            return new Promise(function (resolve, reject) {
                _this._extensionCollection.findOne({ _id: mongo_id }).then(function (model) {
                    let local_model = _this.getModel();
                    // Update the enabled status for this server
                    model.enabled[RegistryIdentifier()] = local_model.enabled[RegistryIdentifier()];
                    _this.setModel(Object.assign({}, local_model, model));
                    resolve(true);
                }, function (find_error) {
                    reject(ErrorHelper('Cannot read from extension registry', find_error));
                });
            });
        };

        let mongo_update = function () {
            return new Promise(function (resolve, reject) {
                let local_model = _this.getModel();
                let model_to_save = Object.assign({}, local_model);
                delete model_to_save._id; // Let mongo handle ids
                _this._extensionCollection.replaceOne({ _id: mongo_id }, model_to_save, { upsert: true }).then(function () {
                    _this.setModel(model_to_save);
                    resolve(true);
                }, function (update_error) {
                    reject(ErrorHelper('Cannot update extension registry', update_error));
                });
            });
        };

        _this._readManifest().then(function (__unused__manifest_data) { // Can read, update extension model
            _this.enable().then(function () {
                mongo_find().then(function () {
                    mongo_update().then(function () {
                        resolve(true); // All good, found, merged and updated
                    }, function (update_error) {
                        reject(ErrorHelper('Failed to update extension', update_error));
                    });
                }, function (find_error) {
                    reject(ErrorHelper('Failed to list extension from the registry', find_error));
                });
            }, function (enable_error) {
                reject(ErrorHelper('Synchronise cannot enable extension', enable_error));
            });
        }, function (__unused__manifest_err) { // Cannot read manifest, forces disabling
            _this.disable().then(function () {
                mongo_find().then(function () {
                    mongo_update().then(function () {
                        resolve(true); // Disabled, found, and updated
                    }, function (update_error) {
                        reject(ErrorHelper('Failed to update disabled extension', update_error));
                    });
                }, function (find_error) {
                    reject(ErrorHelper('Failed to list extension from the registry', find_error));
                });
            }, function (disable_error) {
                reject(ErrorHelper('Synchronise cannot disable extension', disable_error));
            });
        });
    });
};

module.exports = Extension;
