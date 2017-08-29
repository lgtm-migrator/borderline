var chalk = require('chalk');
var express = require('express');
var borderlineServer = require('borderline-server');
var defines = require('../config/borderline.config');

var distributionFolder = './dist';
var publishingFolder = './package';

console.log(chalk.cyan('Starting server in ') + chalk.bold.cyan(process.env.NODE_ENV) + chalk.cyan(' mode ...'));

var app = express();

app.use('/api', borderlineServer(defines));

app.listen(5678, function (err) {
    if (err) {
        console.error(chalk.red('Could not start server ' + err));
        process.exit(1);
    }
});
