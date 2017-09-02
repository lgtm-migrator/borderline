'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (reason, p) => {
    // TO-DO We wait for https://github.com/facebook/jest/issues/2059 to be addressed
    const chalk = require('chalk');
    reason.stack.split('\n').map((line) => {
        console.error(chalk.supportsColor ? chalk.reset.inverse.bold.red(` ERR! `) + ` ${line}` : ` ERR!  ${line}`);
    })
    console.error(chalk.supportsColor ? chalk.reset.inverse.bold.red(' ERR!  v v v v v v v v v v v v v v v v ') : ' ERR!  v v v v v v v v v v v v v v v v ');
});

// Ensure environment variables are read.
require('../config/env');

const jest = require('jest');
const argv = process.argv.slice(2);

// Watch unless on CI or in coverage mode
if (!process.env.CI && argv.indexOf('--coverage') < 0) {
    argv.push('--watch');
}

// @remove-on-eject-begin
// This is not necessary after eject because we embed config into package.json.
const createJestConfig = require('./utils/createJestConfig');
const path = require('path');
const paths = require('../config/paths');
argv.push(
    '--config',
    JSON.stringify(
        createJestConfig(
            relativePath => path.resolve(__dirname, '..', relativePath),
            path.resolve(paths.appSrc, '..'),
            false
        )
    )
);
// @remove-on-eject-end
jest.run(argv);
