let ExtensionStore = require('../core/extensionStore');
const ObjectID = require('mongodb').ObjectID;
const { ErrorHelper, Models } = require('borderline-utils');


/**
 * @fn ExtensionStoreController
 * @param extensionCollection Mongo collection where the extension are stored
 * @constructor
 */
function ExtensionStoreController(extensionCollection) {
    this.extensionCollection = extensionCollection;
    this.extensionStore = new ExtensionStore(extensionCollection);

    this.getAllExtensions = ExtensionStoreController.prototype.getAllExtensions.bind(this);
    this.getExtensionStoreRouter = ExtensionStoreController.prototype.getExtensionStoreRouter.bind(this);
    this.postExtensionStore = ExtensionStoreController.prototype.postExtensionStore.bind(this);

    this.getExtensionByID = ExtensionStoreController.prototype.getExtensionByID.bind(this);
    this.postExtensionByID = ExtensionStoreController.prototype.postExtensionByID.bind(this);
    this.deleteExtensionByID = ExtensionStoreController.prototype.deleteExtensionByID.bind(this);

    this.extensionStore.openStore().catch(function (error) {
        console.error(error.toString()); // eslint-disable-line no-console
    });
}

/**
 * @fn getAllExtensions
 * @param __unused__req Unused Express.js request Object
 * @param res Express.js response Object, .status and .json methods are used
 */
ExtensionStoreController.prototype.getAllExtensions = function (__unused__req, res) {
    let _this = this;
    _this.extensionCollection.find().toArray().then(function (ext_array) {
        if (ext_array) {
            // Processes MongoDB ObjectID to string
            for (let i = 0; i < ext_array.length; i++)
                ext_array[i]._id = ext_array[i]._id.toString();

            res.status(200);
            res.json(ext_array);
        }
        else {
            res.status(404);
            res.json(ErrorHelper('No extensions yet'));
        }
    }, function (findall_error) {
        res.status(501);
        res.json(ErrorHelper('Cannot list all extensions', findall_error));
    });
};

/**
 * @fn getExtensionStoreRouter
 * @return {Router} Express router where the extension get mounted at
 */
ExtensionStoreController.prototype.getExtensionStoreRouter = function () {
    return this.extensionStore.router;
};


/**
 * @fn postExtensionStore
 * @desc Process upload a new extension .zip
 * @param req Express.js request object
 * @param res Express.js response objec
 */
ExtensionStoreController.prototype.postExtensionStore = function (req, res) {

    if (typeof req.files === 'undefined' || req.files === null || req.files.length === 0) {
        res.status(400);
        res.json(ErrorHelper('Zip file upload failed'));
        return;
    }

    // TODO Change the current behavior for the following :
    // Each zip file gets uploaded to an object Store
    // For each zip file, create a Model to insert in DB
    // Let the object store refresh itself

    let extensions = [];
    for (let i = 0; i < req.files.length; i++) {
        let ext = Object.assign({}, Models.BL_MODEL_EXTENSION, {
            zipFile: req.files[i].originalname,
            message: 'Please extract to plugin dir locally'
        });
        extensions.push(ext);
    }

    this.extensionCollection.insertMany(extensions).then(function (result) {
        if (result.insertedCount > 0 && result.ops) {
            res.status(200);
            res.json(result.ops);
        }
        else {
            res.status(500);
            res.json(ErrorHelper('Nothing inserted, abort'));
        }
    }, function (db_error) {
        res.status(500);
        res.json(ErrorHelper('Cannot insert extensions in DB', db_error));
    });
};

/**
 * @fn getExtensionByID
 * @desc Get an extension from its unique identifier
 * @param req
 * @param res
 */
ExtensionStoreController.prototype.getExtensionByID = function (req, res) {
    let id = req.params.id;
    this.extensionCollection.findOne({ _id: new ObjectID(id) }).then(function (result) {
        if (result) {
            res.status(200);
            res.json(result);
        }
        else {
            res.status(501);
            res.json(ErrorHelper('Failed to get extension data'));
        }
    }, function (db_error) {
        res.status(404);
        res.json(ErrorHelper('Unknown extension Id ' + id, db_error));
    });
};

/**
 * @fn postExtensionByID
 * @desc Update an extension referenced by ID.
 * The extension in .zip is reassigned to this ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExtensionStoreController.prototype.postExtensionByID = function (req, res) {
    let id = req.params.id;
    if (typeof req.files === 'undefined' || req.files.length !== 1) {
        res.status(406);
        res.json(ErrorHelper('A unique file must be uploaded for extension ' + id + ' update'));
        return;
    }

    // TODO Change the current behavior for the following :
    // The zip file gets uploaded to an object Store
    // create a Model to insert in DB with a ref on the ObjectStorage
    // Let the object store refresh itself

    let update_model = Object.assign({}, Models.BL_MODEL_EXTENSION, req.body, {
        zipFile: req.files[0].originalname,
        message: 'Please extract to plugin dir locally'
    });
    delete update_model._id; // Let mongo handle ids
    this.extensionCollection.findOneAndUpdate({ _id: new ObjectID(id) },
        { $set: update_model }, { returnOriginal: false }).then(function (update_result) {
            if (update_result.lastErrorObject.n === 1) {
                res.status(200);
                res.json(update_result.value);
            }
            else {
                res.status(500);
                res.json(ErrorHelper('Update aborted', update_result.lastErrorObject));
            }
        }, function (update_error) {
            res.status(501);
            res.json(ErrorHelper('Cannot update extension model', update_error));
        });
};

/**
 * @fn deleteExtensionByID
 * @desc Disables an extension from the server, referenced by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExtensionStoreController.prototype.deleteExtensionByID = function (req, res) {
    let id = req.params.id;
    if (id === undefined || id === null) {
        res.status(404);
        res.json(ErrorHelper('Missing extension ID'));
        return;
    }

    this.extensionCollection.findOneAndDelete({ _id: new ObjectID(id) }).then(function (result) {
        if (result.lastErrorObject.n === 1) {
            // Todo: Remove files form local FS if need be
            res.status(200);
            res.json(true);
        }
        else {
            res.status(404);
            res.json(ErrorHelper('Failed to delete extension ' + id));
        }
    }, function (delete_error) {
        res.status(404);
        res.json(ErrorHelper('Cannot delete extension', delete_error));
    });
};


module.exports = ExtensionStoreController;
