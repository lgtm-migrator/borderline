let userExtensionModule = require('../core/userExtensions');
const { ErrorHelper } = require('borderline-utils');

/**
 * @fn UserExtensionController
 * @desc Controller to manage the users extensions subscriptions
 * @param userCollection MongoDB collection where the users are stored
 * @param extensionCollection MongoDB collection where the extensions are stored
 * @constructor
 */
function UserExtensionController(userCollection, extensionCollection) {
    this.userCollection = userCollection;
    this.extensionCollection = extensionCollection;
    this.userExtension = new userExtensionModule(this.extensionCollection);

    this.getExtensions = UserExtensionController.prototype.getExtensions.bind(this);
    this.deleteExtensions = UserExtensionController.prototype.deleteExtensions.bind(this);
    this.subscribeExtension = UserExtensionController.prototype.subscribeExtension.bind(this);
    this.unsubscribeExtension = UserExtensionController.prototype.unsubscribeExtension.bind(this);
}

/**
 * @fn getExtensions
 * @desc List all extensions for a user referenced by its ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
UserExtensionController.prototype.getExtensions = function (req, res) {
    let user_id = req.params.user_id;
    this.userExtension.listExtensions(user_id).then(function (list) {
        res.status(200);
        res.json(list);
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot list extension for ' + user_id + ' user ID', error));
    });
};

/**
 * @fn deleteExtensions
 * @desc Clear all extensions of a user referenced by its unique identifier
 * @param req Express.js request object
 * @param res Express.js response object
 */
UserExtensionController.prototype.deleteExtensions = function (req, res) {
    let user_id = req.params.user_id;
    this.userExtension.clearExtensions(user_id).then(function (success) {
        res.status(200);
        res.json({ success: success });
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot erase user extensions', error));
    });
};

/**
 * @fn subscribeExtension
 * @desc Subscribe a user referenced by its ID to a extension referenced by its ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
UserExtensionController.prototype.subscribeExtension = function (req, res) {
    let user_id = req.params.user_id;
    let extension_id = req.params.extension_id;
    this.userExtension.subscribe(user_id, extension_id).then(function (success) {
        res.status(200);
        res.json({ success: success });
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot register user extension', error));
    }
    );
};

/**
 * @fn unsubscribeExtensions
 * @desc Unsubscribe a user referenced by its ID from a extension referenced by its ID
 * @param req Express.js request object
 * @param res Express.js response object
 */
UserExtensionController.prototype.unsubscribeExtension = function (req, res) {
    let user_id = req.params.user_id;
    let extension_id = req.params.extension_id;
    this.userExtension.unsubscribe(user_id, extension_id).then(function (success) {
        res.status(200);
        res.json({ success: success });
    }, function (error) {
        res.status(404);
        res.json(ErrorHelper('Cannot remove user extension', error));
    }
    );
};

module.exports = UserExtensionController;
