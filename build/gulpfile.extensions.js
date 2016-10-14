/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton <f.guitton@imperial.ac.uk>. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Increase max listeners for event emitters
require('events').EventEmitter.defaultMaxListeners = 100;

const glob = require('glob');
const gulp = require('gulp');
const path = require('path');

const extensionsPath = path.join(path.dirname(__dirname), 'extensions');

const compilations = glob.sync('**/tsconfig.json', {
    cwd: extensionsPath,
    ignore: ['**/dist/**', '**/node_modules/**']
});

const tasks = compilations.map(function (tsconfigFile) {

    //TO-DO Trigger extensions compilations
    return {};
});

gulp.task('clean-extensions', tasks.map(t => t.clean));
gulp.task('compile-extensions', tasks.map(t => t.compile));
gulp.task('watch-extensions', tasks.map(t => t.watch));

gulp.task('clean-extensions-build', tasks.map(t => t.cleanBuild));
gulp.task('compile-extensions-build', tasks.map(t => t.compileBuild));
gulp.task('watch-extensions-build', tasks.map(t => t.watchBuild));