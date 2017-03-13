#!/usr/bin/env node

var chalk = require('chalk');
var commander = require('commander');
var package = require('./package.json');
var fs = require('fs-extra');
var path = require('path');
var spawn = require('cross-spawn');

var currentWorkingDir = __dirname;
var currentNodeVersion = process.versions.node;
if (currentNodeVersion.split('.')[0] < 7) {
    console.error(
        chalk.red(
            'Borderline Build Extension requires ' +
            chalk.bold('Node 7 or higher.') + '\n' +
            'Please update your version of Node.'
        )
    );
    process.exit(1);
}

var program = commander
    .version(package.version)
    .option('-p, --path <path>', 'extension path')
    .option('--verbose', 'enable verbose [optional]')
    .usage('--extension <name>')
    .on('--help', function () {
        console.log();
        console.log(chalk.cyan('The extension will be created in a directory of the same name.'));
        console.log();
    })
    .parse(process.argv);

/* Ensure path is specified */
if (typeof program.path === 'undefined' || program.path === '' || !program.path) {
    program.path = __dirname;
    console.log();
    console.error(chalk.red('Missing extension directory path'));
    console.log();
    process.exit(1);
}

/* Creating the extension folder */
buildExtension(program.path, program.verbose);

function buildExtension(extensionPath, verbose) {
    var extensionDir = path.resolve(extensionPath);

    if (! fs.existsSync(extensionDir)) {
        console.log(chalk.red('Invalid extension path: ') + extensionDir);
        process.exit(1);
    }


    /* Go to extension dir*/
    process.chdir(extensionDir);
    if (verbose)
        console.log(chalk.green('Moving to extension directory'));

    /* Get this extension local dependencies */
    var install_proc = spawn('npm', ['install', '--save-dev'], {stdio: 'inherit'});
    install_proc.on('close', function (exitCode) {
        if (exitCode !== 0) {
            console.log(chalk.red('Install package dependencies failed'));
            process.exit(1);
        }
        if (verbose)
            console.log(chalk.cyan('Installed package dependencies'));

        /* Create a webpack process */
        var webpack_proc = spawn('npm', ['run', 'build']);
        webpack_proc.on('close', function(exitCode) {
            if (exitCode !== 0) {
                console.log(chalk.red('Build using webpack failed'));
                process.exit(1);
            }
            if (verbose)
                console.log(chalk.cyan('Build with webpack successful'));

            /* Moving back to working directory */
            process.chdir(currentWorkingDir);
            if (verbose)
                console.log(chalk.cyan('Going back to original directory'));

            /* All good */
            console.log(chalk.green('Build success :D'));
        });
    });
}
