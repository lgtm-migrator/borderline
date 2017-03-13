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

var program = commander
    .version(package.version)
    .option('-e, --extension <name>', 'extension name')
    .option('-p, --path <path>', 'extension path')
    .option('--verbose', 'enable verbose [optional]')
    .usage('--extension <name>')
    .on('--help', function () {
        console.log();
        console.log(chalk.cyan('The extension will be created in a directory of the same name.'));
        console.log();
    })
    .parse(process.argv);

/* Ensure extension name is provided */
if (typeof program.extension === 'undefined' || program.extension === '' || !program.extension  ) {
    console.log();
    console.error(chalk.red('Missing extension name'));
    console.error(program.help());
    console.log();
    process.exit(1);
}
/* Default path if no specified */
if (typeof program.path === 'undefined' || program.path === '' || !program.path) {
    program.path = __dirname;
    console.log();
    console.log('Using current directory : ' + chalk.cyan(__dirname));
    console.log();
}

/* Creating the extension folder */
createExtension(program.extension, program.path, program.verbose);

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
