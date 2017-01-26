var path = require('path');
var chalk = require('chalk');
var fs = require('fs-extra');
var webpack = require('webpack');
var express = require('express');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var config = require('../config/webpack.config')();
// var borderlineServer = require('borderline-server');

var distributionFolder = './dist';
var publishingFolder = './package';

console.log(chalk.cyan('Starting server in ') + chalk.bold.cyan(process.env.NODE_ENV) + chalk.cyan(' mode ...'));
cleanFolder();
console.log(chalk.gray('Launching now ...'));

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

function cleanFolder() {
    console.log(chalk.gray('Doing some cleanup first first ...'));
    try {
        fs.removeSync(distributionFolder);
        fs.removeSync(publishingFolder);
    } catch (err) {
        return console.error(chalk.red('Error purging destination folder ' + err));
    }
}
