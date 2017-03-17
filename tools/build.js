/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

var fs = require('fs-extra');
var chalk = require('chalk');
var exec = require('child_process').exec;
var pkg = require('../package.json');

var configFile = './config/webpack.config.js';
var distributionFolder = './dist';

startBuilding();

function startBuilding() {
    console.log(chalk.gray(`Starting building process for v${pkg.version} ...`));
    purgeFolders();
}

function purgeFolders() {
    console.log(chalk.gray('Purging destination folders ...'));
    try {
        fs.removeSync(distributionFolder);
    } catch (err) {
        console.error(chalk.red('Error purging destination folder ' + err));
        process.exit(1);
    }
    createDestination();
}

function createDestination() {
    console.log(chalk.gray('Creating necessary folders ...'));
    fs.ensureDir(distributionFolder, function (err) {
        if (err) {
            console.error(chalk.red('Error creating destination folder ' + err));
            process.exit(1);
        }
        buildBundle();
    });
}

function buildBundle() {
    console.log(chalk.cyan('Baking Borderline (this may take a while) ...'));
    var command = 'webpack';
    var args = ['--config', configFile];

    exec(command + ' ' + args.join(' '), function (error) {
        copyDistribution(error);
    });
}

function copyDistribution(error) {
    if (error) {
        console.error(chalk.red('Built has failed.'));
        process.exit(1);
    } else
        console.log(chalk.green('Built was a success !'));
}
