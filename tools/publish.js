/* -------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 * ---------------------------------------------------------------------------------------- */

var fs = require('fs-extra');
var chalk = require('chalk');
var exec = require('child_process').exec;
var pkg = require('../package.json');

var distributionFolder = './dist';
var publishingFolder = './package';

startPublish();

function startPublish() {
    console.log(chalk.gray(`Starting publishing process for v${pkg.version} ...`));
    purgeFolders(createDestination);
}

function purgeFolders(callback) {
    console.log(chalk.gray('Purging destination folders ...'));
    try {
        fs.removeSync(distributionFolder);
        fs.removeSync(publishingFolder);
    } catch (err) {
        console.error(chalk.red('Error purging destination folder ' + err));
        process.exit(1);
    }
    callback();
}

function createDestination() {
    console.log(chalk.gray('Creating necessary folders ...'));
    fs.ensureDir(publishingFolder, function (err) {
        if (err) {
            console.error(chalk.red('Error creating destination folder ' + err));
            process.exit(1);
        }
        copyFiles();
    });
}

function copyFiles() {
    console.log(chalk.gray('Copying skeleton files ...'));
    ['LICENSE', 'README.md'].forEach(function (item) {
        try {
            fs.copySync('./' + item, publishingFolder + '/' + item, {
                overwrite: true
            });
        } catch (err) {
            console.error(chalk.red('Error copying ' + err));
            process.exit(1);
        }
    });
    wrapPackageDescription();
}

function wrapPackageDescription() {
    console.log(chalk.gray('Compiling package description ...'));
    delete pkg.scripts;
    delete pkg.devDependencies;
    delete pkg.dependencies;

    try {
        fs.writeJSONSync(publishingFolder + '/package.json', pkg);
    } catch (err) {
        console.error(chalk.red('Error writting ' + err));
        process.exit(1);
    }
    ensureBuildIsReady();
}

function ensureBuildIsReady() {
    console.log(chalk.cyan('Baking Borderline (this may take a while) ...'));
    var command = 'npm';
    var args = ['run', 'build'];

    exec(command + ' ' + args.join(' '), function (error) {
        copyDistribution(error);
    });
}

function copyDistribution() {
    console.log(chalk.gray('Transfering distribution files ...'));
    try {
        fs.copySync(distributionFolder, publishingFolder, {
            overwrite: true
        });
    } catch (err) {
        console.error(chalk.red('Error copying ' + err));
        process.exit(1);
    }
    sendToServer();
}

function sendToServer() {
    console.log(chalk.gray('Sending to NPM servers ...'));
    var command = 'npm';
    var args = ['publish'];

    exec(command + ' ' + args.join(' '), {
        cwd: publishingFolder
    }, function (error) {
        finalizeExport(error);
    });
}

function finalizeExport(error) {
    if (error) {
        console.error(chalk.red('Export has failed. Check package version and user credentials.'));
        process.exit(1);
    } else
        console.log(chalk.green('Export was a success !'));
    purgeFolders(() => { });
}
