var path = require('path');

var pluginStore = require('../core/plugin_store');

var plugin_store = new pluginStore(path.join(__dirname, "../plugins"));

module.exports.getPluginStoreRouter = function() {
    return plugin_store.router;
}

module.exports.getPluginStore = function(req, res, next) {
    var plugin_list = plugin_store.listPlugins();
    res.status(200);
    res.jsonp(plugin_list);
};

module.exports.postPluginStore = function(req, res, next) {

    if (typeof req.files === 'undefined' || req.files === null || req.files.length == 0){
        res.status(406);
        res.json({error: "Zip file upload failed"});
        return;
    }

    var plugins =[];
    for (var i = 0; i < req.files.length; i++) {
        var p = plugin_store.createPluginFromFile(req.files[i]);
        plugins.push(p);
    }
    res.status(200);
    res.json(plugins);
};

module.exports.deletePluginStore = function(req, res, next) {
    res.status(403);
    res.json({error: "Permission denied: Nope you don't remove my plugins"});
};


module.exports.getPluginByID = function(req, res) {
    var id = req.params.id;
    var info = plugin_store.getPluginInfoById(id);
    if (info !== null) {
        res.status(200);
        res.json(info);
    }
    else {
        res.status(401);
        res.json({error: `Unknown plugin Id ${id} ]`});
    }
};

module.exports.postPluginByID = function(req, res) {
    id = req.params.id;
    if (typeof req.files === 'undefined' || req.files.length == 0) {
        res.status(406);
        res.json({error: `No file uploaded for plugin ${id} update`});
        return;
    }
    var updateReply = plugin_store.updatePluginById(id, req.files[0]);
    if (updateReply.hasOwnProperty('error') == true)
        res.status(401);
    else
        res.status(200);
    res.json(updateReply);
};

module.exports.deletePluginByID = function(req, res) {
    var id = req.params.id;
    var deleteReply = plugin_store.deletePluginById(id);
    if (deleteReply.hasOwnProperty('error') == true)
        res.status(401);
    else
        res.status(200);
    res.json(deleteReply);
};

module.exports.getPluginStoreUpload = function(req, res, next) {
    res.status(200);
    res.send(
        '<form action="/plugin_store" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="plugin-zip" accept=".zip">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
};

module.exports.getPluginStoreUploadByID = function(req, res, next) {
    var id = req.params.id;
    res.status(200);
    res.send(
        '<form action="/plugin_store/${id}" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="plugin-zip" accept=".zip">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
};
