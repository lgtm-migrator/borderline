var userPluginModule = require('../core/userPlugins');

function UserPluginController(mongoDBCollection) {
    this.pluginCollection = mongoDBCollection;
    this.userPlugin = new userPluginModule(this.pluginCollection);

    this.getPlugins = UserPluginController.prototype.getPlugins.bind(this);
    this.deletePlugins = UserPluginController.prototype.deletePlugins.bind(this);
    this.subscribePlugin = UserPluginController.prototype.subscribePlugin.bind(this);
    this.unsubscribePlugin = UserPluginController.prototype.unsubscribePlugin.bind(this);
}

UserPluginController.prototype.getPlugins = function(req, res) {
    var user_id = req.params.user_id;
    this.userPlugin.listPlugins(user_id).then(function (list) {
        res.status(200);
        res.json(list);
    },
    function (error) {
        res.status(501);
        res.json({ error: 'Cannot list plugin for ' + user_id + ' user ID ' + error });
    });
};

UserPluginController.prototype.deletePlugins = function(req, res) {
    var user_id = req.params.user_id;
    this.userPlugin.clearPlugins(user_id).then(function (success) {
        res.status(200);
        res.json({ success: success });
    },
    function (error) {
        res.status(501);
        res.json({ error: 'Cannot erase user plugins' + error.toString()});
    });
};

UserPluginController.prototype.subscribePlugin = function(req, res) {
    var user_id = req.params.user_id;
    var plugin_id = req.params.plugin_id;
    this.userPlugin.subscribe(user_id, plugin_id).then(
        function(success) {
            res.status(200);
            res.json({ success: success });
        },
        function (error) {
            res.status(501);
            res.json({ error: 'Cannot register user plugin: ' + error });
        }
    );
};

UserPluginController.prototype.unsubscribePlugin = function(req, res) {
    var user_id = req.params.user_id;
    var plugin_id = req.params.plugin_id;
    this.userPlugin.unsubscribe(user_id, plugin_id).then(
        function(success) {
            res.status(200);
            res.json({ success: success });
        },
        function (error) {
            res.status(501);
            res.json({ error: 'Cannot remove user plugin: ' + error });
        }
    );
};

module.exports = UserPluginController;
