var path = require('path');
var webpack = require('webpack');
var express = require('express');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var config = require('../config/webpack.config')();
// var borderlineServer = require('borderline-server');

var app = express();
var compiler = webpack(config);

app.use(devMiddleware(compiler, {
    publicPath: '',
    stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
            green: '\u001b[32m',
        }
    }
}));

if (process.env.NODE_ENV !== 'production')
    app.use(hotMiddleware(compiler));

// app.use(borderlineServer({}));
app.use('*', function (req, res, next) {
    var filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, function (err, result) {
        if (err) {
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }
});
