#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Florian Guitton
 * All rights reserved.
 *
 * Code adapted from Facebook Incbator extension
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// borderline-create-extension is installed globally on people's computers.
// This means that it is extremely difficult to have them upgrade the version
// and because there's only one global version installed, it is very prone to
// breaking changes.
//
// The only job of borderline-create-extension is to init the repository and
// then forward all the commands to the local version of
// borderline-create-extension.
//
// If you need to add a new command, please add it to the scripts/ folder.
//
// The only reason to modify this file is to add more warnings and
// troubleshooting information for the `borderline-create-extension` command.
//
// Do not make breaking changes! We absolutely don't want to have to
// tell people to update their global version of borderline-create-extension.
//
// Also be careful with new language features.
// This file must work on Node 0.10+.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

'use strict';

var chalk = require('chalk');

var currentNodeVersion = process.versions.node
if (currentNodeVersion.split('.')[0] < 7) {
    console.log();
    console.error(
        chalk.red(
            'You are running Node ' + currentNodeVersion + '.\n' +
            'Borderline Create Extension requires Node 7 or higher. \n' +
            'Please update your version of Node.'
        )
    );
    console.log();
    process.exit(1);
}

var commander = require('commander');
var fs = require('fs-extra');
var path = require('path');
var execSync = require('child_process').execSync;
var spawn = require('cross-spawn');
var semver = require('semver');

var extensionName;

var program = commander
    .version(require('./package.json').version)
    .arguments('<extension-name>')
    .usage(chalk.green('<extension-name>') + ' [options]')
    .action(function (name) {
        extensionName = name;
    })
    .option('--verbose', 'print additional logs')
    .option('--scripts-version <alternative-package>', 'use a non-standard version of borderline-scripts')
    .allowUnknownOption()
    .on('--help', function () {
        console.log();
        console.log('    Only ' + chalk.green('<extension-name>') + ' is required.');
        console.log();
        console.log('    The extension will be created in a directory of the same name.');
        console.log();
        console.log('    If you have any problems, do not hesitate to file an issue:');
        console.log('      ' + chalk.cyan('https://github.com/dsi-icl/borderline-create-extension/issues/new'));
        console.log();
    })
    .parse(process.argv);

if (typeof extensionName === 'undefined') {
    console.log();
    console.error('Please specify the extension name:');
    console.log('  ' + chalk.cyan(program.name()) + chalk.green(' <extension-name>'));
    console.log();
    console.log('For example:');
    console.log('  ' + chalk.cyan(program.name()) + chalk.green(' my-borderline-plugin'));
    console.log();
    console.log('Run ' + chalk.cyan(program.name() + ' --help') + ' to see all options.');
    process.exit(1);
}

createApp(extensionName, program.verbose, program.scriptsVersion);

function createApp(name, verbose, version) {
    var root = path.resolve(name);
    var appName = path.basename(root);

    checkAppName(appName);
    fs.ensureDirSync(name);
    if (!isSafeToCreateExtensionIn(root)) {
        console.log();
        console.log('The name ' + chalk.green(name) + ' is already used and conflicts.');
        console.log('Try using another name.');
        console.log();
        process.exit(1);
    }

    console.log();
    console.log('Creating a new Borderline Extension in ' + chalk.green(root) + '.');
    console.log();

    var packageJson = {
        name: appName,
        version: '0.0.1',
        private: true
    };
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
    var originalName = process.cwd();
    process.chdir(root);

    console.log('Installing packages. This might take a couple minutes.');
    console.log('Installing ' + chalk.cyan('borderline-scripts') + '...');
    console.log();

    run(root, appName, version, verbose, originalName);
}

function install(packageToInstall, verbose, callback) {
    var command = 'npm';
    var args = ['install', '--save-dev', '--save-exact', packageToInstall];

    if (verbose) {
        args.push('--verbose');
    }

    var child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', function (code) {
        callback(code, command, args);
    });
}

function run(root, appName, version, verbose, originalName, template) {
    var packageToInstall = getInstallPackage(version);
    var packageName = getPackageName(packageToInstall);

    install(packageToInstall, verbose, function (code, command, args) {
        if (code !== 0) {
            console.error(chalk.cyan(command + ' ' + args.join(' ')) + ' failed');
            process.exit(1);
        }

        checkNodeVersion(packageName);

        var scriptsPath = path.resolve(
            process.cwd(),
            'node_modules',
            packageName,
            'scripts',
            'init.js'
        );
        var init = require(scriptsPath);
        init(root, appName, verbose, originalName, template);
    });
}

function getInstallPackage(version) {
    var packageToInstall = 'borderline-scripts';
    var validSemver = semver.valid(version);
    if (validSemver) {
        packageToInstall += '@' + validSemver;
    } else if (version) {
        // for tar.gz or alternative paths
        packageToInstall = version;
    }
    return packageToInstall;
}

// Extract package name from tarball url or path.
function getPackageName(installPackage) {
    if (installPackage.indexOf('.tgz') > -1) {
        // The package name could be with or without semver version, e.g. react-scripts-0.2.0-alpha.1.tgz
        // However, this function returns package name only without semver version.
        return installPackage.match(/^.+\/(.+?)(?:-\d+.+)?\.tgz$/)[1];
    } else if (installPackage.indexOf('@') > 0) {
        // Do not match @scope/ when stripping off @version or @tag
        return installPackage.charAt(0) + installPackage.substr(1).split('@')[0];
    }
    return installPackage;
}

function checkNodeVersion(packageName) {
    var packageJsonPath = path.resolve(
        process.cwd(),
        'node_modules',
        packageName,
        'package.json'
    );
    var packageJson = require(packageJsonPath);
    if (!packageJson.engines || !packageJson.engines.node) {
        return;
    }

    if (!semver.satisfies(process.version, packageJson.engines.node)) {
        console.error(
            chalk.red(
                'You are running Node %s.\n' +
                'Borderline Create Extension requires Node %s or higher. \n' +
                'Please update your version of Node.'
            ),
            process.version,
            packageJson.engines.node
        );
        process.exit(1);
    }
}

function checkAppName(appName) {
    // TODO: there should be a single place that holds the dependencies
    var dependencies = ['react', 'react-dom'];
    var devDependencies = ['borderline-scripts'];
    var allDependencies = dependencies.concat(devDependencies).sort();

    if (allDependencies.indexOf(appName) >= 0) {
        console.error(
            chalk.red(
                'We cannot create a extension called ' + chalk.green(appName) + ' because a dependency with the same name exists.\n' +
                'Due to the way npm works, the following names are not allowed:\n\n'
            ) +
            chalk.cyan(
                allDependencies.map(function (depName) {
                    return '  ' + depName;
                }).join('\n')
            ) +
            chalk.red('\n\nPlease choose a different extension name.')
        );
        process.exit(1);
    }
}

// If extension only contains files generated by GitHub, it’s safe.
// We also special case for IDEs
function isSafeToCreateExtensionIn(root) {
    var validFiles = [
        '.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', '.vscode', 'README.md', 'LICENSE'
    ];
    return fs.readdirSync(root)
        .every(function (file) {
            return validFiles.indexOf(file) >= 0;
        });
}
