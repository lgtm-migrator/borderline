/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton <f.guitton@imperial.ac.uk>. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const es = require('event-stream');
const _ = require('underscore');
const util = require('gulp-util');
const server = require('./server')();

const allErrors = [];
let startTime = null;
let count = 0;

function start() {
    if (count++ > 0) {
        return;
    }

    startTime = new Date().getTime();
    util.log(`Starting ${util.colors.green('compilation')}...`);
}

function end() {
    if (--count > 0) {
        return;
    }

    const errors = _.flatten(allErrors);
    errors.map(err => util.log(`${util.colors.red('Error')}: ${err}`));

    util.log(`Finished ${util.colors.green('compilation')} with ${errors.length} errors after ${util.colors.magenta((new Date().getTime() - startTime) + ' ms')}`);
    server.restart();
}

module.exports = () => {
    const errors = [];
    allErrors.push(errors);

    const result = err => errors.push(err);
    result.hasErrors = () => errors.length > 0;

    result.end = emitError => {
        errors.length = 0;
        start();

        return es.through(null, function () {
            end();

            if (emitError && errors.length > 0) {
                this.emit('error', 'Errors occurred.');
            } else {
                this.emit('end');
            }
        });
    };

    return result;
};