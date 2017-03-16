#!/usr/bin/env node

var chalk = require('chalk');
var commander = require('commander');
var package = require('./package.json');
var fs = require('fs-extra');
var path = require('path');

var currentNodeVersion = process.versions.node;
if (currentNodeVersion.split('.')[0] < 7) {
    console.error(
        chalk.red(
            'Borderline Create Extension requires ' +
            chalk.bold('Node 7 or higher.') + '\n' +
            'Please update your version of Node.'
        )
    );
    process.exit(1);
}

var extensionName = undefined;
var program = commander
    .version(package.version)
    .arguments('<name>')
    .option('--verbose', 'enable verbose [optional]')
    .usage('<name>')
    .on('--help', function () {
        console.log();
        console.log(chalk.cyan('The extension will be created in a directory of the same name.'));
        console.log();
    })
    .action(function (name) {
        extensionName = name;
    })
    .parse(process.argv);

/* Ensure extension name is provided */
if (typeof extensionName === 'undefined' || extensionName === '' || !extensionName  ) {
    console.log();
    console.error(chalk.red('Missing extension name'));
    console.error(program.help());
    console.log();
    process.exit(1);
}

/* Creating the extension folder */
createExtension(extensionName, './src/', program.verbose);

function createExtension(extensionName, extensionPath, verbose) {
    var templateDir = path.join(__dirname, 'template');
    var extensionDir = path.join(extensionPath, extensionName);

    if (! fs.existsSync(templateDir)) {
        console.log(chalk.red('Missing template: ') + templateDir);
        process.exit(1);
    }
    fs.copySync(templateDir, extensionDir);

    if (verbose)
        console.log(chalk.cyan('Created extension from template'));

    var extensionPackagePath = path.join(extensionDir, 'package.json');
    var extensionPackage = fs.readJsonSync(extensionPackagePath);
    extensionPackage.name = extensionName;
    fs.writeJsonSync(extensionPackagePath, extensionPackage);

    if (verbose)
        console.log(chalk.cyan('Rewrite package.json successful'));
    console.log(chalk.green('Creating extension success :D'));
}
