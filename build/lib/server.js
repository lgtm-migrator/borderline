/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton <f.guitton@imperial.ac.uk>. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const es = require('event-stream');
const util = require('gulp-util');
const watch = require('gulp-watch');
const spawn = require('child_process').spawn;

let nodeServer;

function start() {

    nodeServer = spawn('node', ['application.js'], { cwd: 'dist/dev', stdio: 'inherit' })
    util.log(`Starting ${util.colors.green('serving')}`);
    nodeServer.on('close', function (code) {
        if (code > 0)
            util.log(`Serving ${util.colors.red('failed')} error code ${util.colors.magenta(code)}, waiting for changes...`);
        else
            util.log(`Serving ${util.colors.green('exited')} with no error`);
    });
};

function stop() {

    if (nodeServer) {
        util.log(`Killing ${util.colors.yellow('serving')}`);
        nodeServer.kill();
    }
};

function restart() {

    stop();
    start();
};

module.exports = () => {

    const result = {};

    result.start = () => {
        start();
    };
    result.stop = () => {
        stop();
    };
    result.restart = () => {
        restart();
    };

    return result;
}
