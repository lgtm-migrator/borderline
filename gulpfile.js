/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Florian Guitton <f.guitton@imperial.ac.uk>. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

// Increase max listeners for event emitters
require('events').EventEmitter.defaultMaxListeners = 100;

const _ = require('underscore');
const es = require('event-stream');
const glob = require('glob');
const gulp = require('gulp');
const tsb = require('gulp-tsb');
const bom = require('gulp-bom');
const plumber = require('gulp-prettyerror');
const path = require('path');
const util = require('./build/lib/util');
const server = require('./build/lib/server')();
const watcher = require('./build/lib/watch');
const reporter = require('./build/lib/reporter')();
const sourcemaps = require('gulp-sourcemaps');

const rootDir = path.join(__dirname, 'src');
const options = require('./src/tsconfig.json').compilerOptions;
options.verbose = false;
options.sourceMap = true;
options.rootDir = rootDir;
options.sourceRoot = util.toFileUri(rootDir);

function createCompile(build, emitError) {
    const opts = _.clone(options);
    opts.inlineSources = !!build;
    opts.noFilesystemLookup = true;

    const ts = tsb.create(opts, null, null, err => reporter(err.toString()));

    return function (token) {
        const utf8Filter = util.filter(data => /(\/|\\)test(\/|\\).*utf8/.test(data.path));
        const tsFilter = util.filter(data => /\.ts$/.test(data.path));
        const noDeclarationsFilter = util.filter(data => !(/\.d\.ts$/.test(data.path)));

        const input = es.through();
        const output = input
            .pipe(plumber())
            .pipe(utf8Filter)
            .pipe(bom())
            .pipe(utf8Filter.restore)
            .pipe(tsFilter)
            .pipe(util.loadSourcemaps())
            .pipe(ts(token))
            .pipe(noDeclarationsFilter)
            .pipe(build ? nls() : es.through())
            .pipe(noDeclarationsFilter.restore)
            .pipe(sourcemaps.write('.', {
                addComment: false,
                includeContent: !!build,
                sourceRoot: options.sourceRoot
            }))
            .pipe(tsFilter.restore)
            .pipe(reporter.end(emitError));

        return es.duplex(input, output);
    };
}

function compileTask(out, build) {
    const compile = createCompile(build, true);

    return function () {
        const src = es.merge(
            gulp.src('src/**', { base: 'src' }),
            gulp.src('node_modules/typescript/lib/lib.d.ts')
        );

        return src
            .pipe(plumber())
            .pipe(compile())
            .pipe(gulp.dest(out));
    };
}


function watchTask(out, build) {
    const compile = createCompile(build);

    return function () {
        const src = es.merge(
            gulp.src('src/**', { base: 'src' }),
            gulp.src('node_modules/typescript/lib/lib.d.ts')
        );

        return watcher('src/**', { base: 'src' })
            .pipe(util.incremental(compile, src, true))
            .pipe(gulp.dest(out));
    };
}

// Fast compile for development time
gulp.task('clean-client', util.rimraf('dist'));
gulp.task('compile-client', ['clean-client'], compileTask('dist', false));
gulp.task('watch-client', ['clean-client'], watchTask('dist', false));

// Full compile, including nls and inline sources in sourcemaps, for build
gulp.task('clean-client-build', util.rimraf('dist-build'));
gulp.task('compile-client-build', ['clean-client-build'], compileTask('dist-build', true));
gulp.task('watch-client-build', ['clean-client-build'], watchTask('dist-build', true));

// Default
gulp.task('default', ['compile']);

// All
gulp.task('clean', ['clean-client', 'clean-extensions']);
gulp.task('compile', ['compile-client', 'compile-extensions']);
gulp.task('watch', ['watch-client', 'watch-extensions']);

// All Build
gulp.task('clean-build', ['clean-client-build', 'clean-extensions-build']);
gulp.task('compile-build', ['compile-client-build', 'compile-extensions-build']);
gulp.task('watch-build', ['watch-client-build', 'watch-extensions-build']);

gulp.task('test', function () {
    return gulp.src('test/all.js')
        .pipe(mocha({ ui: 'tdd', delay: true }))
        .once('end', function () { process.exit(); });
});

const build = path.join(__dirname, 'build');
glob.sync('gulpfile.*.js', { cwd: build })
    .forEach(f => require(`./build/${f}`));

process.on('exit', function () {
    server.stop();
})