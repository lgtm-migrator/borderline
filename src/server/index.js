//External node module imports
var path = require('path');
var webpack = require('webpack');
var express = require('express');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var config = require('../../webpack.config');
var app = express();
var compiler = webpack(config);
var multer  = require('multer');

//Controllers imports
var pluginStoreController = require('./controllers/plugin_store');

app.use(devMiddleware(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: {
        colors: true
    },
}));
app.use(hotMiddleware(compiler));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

//TEMPORARY getter on a form to upload plugins zip file
app.get("/plugin_store/upload", pluginStoreController.getPluginStoreUpload);
//TEMPORARY getter on a form to update plugins zip file
app.get("/plugin_store/upload/:id", pluginStoreController.getPluginStoreUploadByID);

// [ Plugin Store Routes
app.route('/plugin_store')
    .get(pluginStoreController.getPluginStore) //GET returns the list of available plugins
    .post(multer().any(), pluginStoreController.postPluginStore) //POST upload a new plugin
    .delete(pluginStoreController.deletePluginStore); //DELETE clears all the plugins
app.route('/plugin_store/:id')
    .get(pluginStoreController.getPluginByID) //:id GET returns plugin metadata
    .post(multer().any(), pluginStoreController.postPluginByID) //:id POST update a plugin content
    .delete(pluginStoreController.deletePluginByID); //:id DELETE removes a specific plugin
// ] Plugin Store Routes
app.use("/plugins", pluginStoreController.getPluginStoreRouter());

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
});
