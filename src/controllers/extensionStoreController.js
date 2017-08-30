let extensionStoreModule = require('../core/extensionStore');
const defines = require('../defines.js');

/**
 * @fn ExtensionStoreContrller
 * @param mongoDBCollection Mongo collection where the extension are stored
 * @constructor
 */
function ExtensionStoreController(mongoDBCollection, gridFSObjectStorage) {
    this.mongoDBCollection = mongoDBCollection;
    this.extensionStore = new extensionStoreModule(this.mongoDBCollection, gridFSObjectStorage);

    this.getExtensionStoreRouter = ExtensionStoreController.prototype.getExtensionStoreRouter.bind(this);
    this.getExtensionStore = ExtensionStoreController.prototype.getExtensionStore.bind(this);
    this.postExtensionStore = ExtensionStoreController.prototype.postExtensionStore.bind(this);
    this.deleteExtensionStore = ExtensionStoreController.prototype.deleteExtensionStore.bind(this);
    this.getExtensionByID = ExtensionStoreController.prototype.getExtensionByID.bind(this);
    this.postExtensionByID = ExtensionStoreController.prototype.postExtensionByID.bind(this);
    this.deleteExtensionByID = ExtensionStoreController.prototype.deleteExtensionByID.bind(this);
}

/**
 * @fn getExtensionStoreRouter
 * @return {Router} Express router where the extension get mounted at
 */
ExtensionStoreController.prototype.getExtensionStoreRouter = function() {
    return this.extensionStore.router;
};

/**
 * @fn getExtensionStore
 * @desc List all the extensions
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExtensionStoreController.prototype.getExtensionStore = function(__unused__req, res) {
    let extension_list = this.extensionStore.listExtensions();
    res.status(200);
    res.json({ extensions: extension_list });
};

/**
 * @fn postExtensionStore
 * @desc Process upload a new extension .zip
 * @param req Express.js request object
 * @param res Express.js response objec
 */
ExtensionStoreController.prototype.postExtensionStore = function(req, res) {

    if (typeof req.files === 'undefined' || req.files === null || req.files.length === 0){
        res.status(400);
        res.json(defines.errorStacker('Zip file upload failed'));
        return;
    }

    let extensions = [];
    for (let i = 0; i < req.files.length; i++) {
        let p = this.extensionStore.createExtensionFromFile(req.files[i]);
        extensions.push(p);
    }

    res.status(200);
    res.json(extensions);
};

/**
 * @fn deleteExtensionStore
 * @desc Removes all extensions from the store
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExtensionStoreController.prototype.deleteExtensionStore = function(__unused__req, res) {
    this.extensionStore.clearExtensions();
    res.status(200);
    res.json({ message: 'Removed all server extensions' });
};

/**
 * @fn getExtensionByID
 * @desc Get an extension from its unique identifier
 * @param req
 * @param res
 */
ExtensionStoreController.prototype.getExtensionByID = function(req, res) {
    let id = req.params.id;
    let info = this.extensionStore.getExtensionInfoById(id);
    if (info !== null) {
        res.status(200);
        res.json(info);
    }
    else {
        res.status(404);
        res.json(defines.errorStacker('Unknown extension Id ' +  id));
    }
};

/**
 * @fn postExtensionByID
 * @desc Update an extension referenced by ID.
 * The extension in .zip is reassigned to this ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExtensionStoreController.prototype.postExtensionByID = function(req, res) {
    let id = req.params.id;
    if (typeof req.files === 'undefined' || req.files.length === 0) {
        res.status(400);
        res.json(defines.errorStacker('No file uploaded for extension ' + id + ' update'));
        return;
    }
    let updateReply = this.extensionStore.updateExtensionById(id, req.files[0]);
    if (updateReply.hasOwnProperty('error') === true)
        res.status(500);
    else
        res.status(200);
    res.json(updateReply);
};

/**
 * @fn deleteExtensionByID
 * @desc remvoes an extension from the server, referenced by ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
ExtensionStoreController.prototype.deleteExtensionByID = function(req, res) {
    let id = req.params.id;
    let deleteReply = this.extensionStore.deleteExtensionById(id);
    if (deleteReply.hasOwnProperty('error') === true)
        res.status(404);
    else
        res.status(200);
    res.json(deleteReply);
};


module.exports = ExtensionStoreController;
