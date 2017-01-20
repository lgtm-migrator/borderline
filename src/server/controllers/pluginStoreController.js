var path = require('path');

var pluginStoreModule = require('../core/pluginStore');

var pluginStore = new pluginStoreModule(path.join(__dirname, "../plugins"));

module.exports.getPluginStoreRouter = function() {
    return pluginStore.router;
}

module.exports.getPluginStore = function(req, res, next) {
    var plugin_list = pluginStore.listPlugins();
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
        var p = pluginStore.createPluginFromFile(req.files[i]);
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
    var info = pluginStore.getPluginInfoById(id);
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
    var updateReply = pluginStore.updatePluginById(id, req.files[0]);
    if (updateReply.hasOwnProperty('error') == true)
        res.status(401);
    else
        res.status(200);
    res.json(updateReply);
};

module.exports.deletePluginByID = function(req, res) {
    var id = req.params.id;
    var deleteReply = pluginStore.deletePluginById(id);
    if (deleteReply.hasOwnProperty('error') == true)
        res.status(401);
    else
        res.status(200);
    res.json(deleteReply);
};

module.exports.getPluginStoreUpload = function(req, res, next) {
    res.status(200);
    res.send(
        '<form action="/pluginStore" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="plugin-zip" accept=".zip">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
};

module.exports.getPluginStoreUploadByID = function(req, res, next) {
    var id = req.params.id;
    res.status(200);
    res.send(
        '<form action="/pluginStore/${id}" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="plugin-zip" accept=".zip">'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
};
