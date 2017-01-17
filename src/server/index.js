var path = require('path');
var webpack = require('webpack');
var express = require('express');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var config = require('../../webpack.config');

var app = express();
var compiler = webpack(config);


var pm = require('./pluginManager');

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

app.all("/api/:plugin-uuid/*", function(req, res, next) {
    var targetedPlugin = pluginManager.find(req.params["plugin-uuid"]);
    if (targetedPlugin) {
        next();
    }
    else {
        res.send("Unknown plugin route", 404);
    }
});

var pluginManager = new pm(app, path.join(__dirname, "/plugins"), "/api");
pluginManager.watch();

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
});
