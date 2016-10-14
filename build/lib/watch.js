/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton <f.guitton@imperial.ac.uk>. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const es = require('event-stream');
const watch = require('gulp-watch');
const plumber = require('gulp-prettyerror');

/** Ugly hack for gulp-tsb */
function handleDeletions() {
    return es.mapSync(f => {
        if (/\.ts$/.test(f.relative) && !f.contents) {
            f.contents = new Buffer('');
            f.stat = { mtime: new Date() };
        }

        return f;
    });
}

module.exports = function () {
    return watch.apply(null, arguments)
        .pipe(plumber())
        .pipe(handleDeletions());
};