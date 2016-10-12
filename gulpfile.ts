import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';

import { BORDERLINE_TASKS_DIR } from './tools/config';
import { loadTasks } from './tools/utils';

loadTasks(BORDERLINE_TASKS_DIR);

// --------------
// Build dev.
gulp.task('build.dev', (done: any) =>
  runSequence(
    'clean.dev',
    // 'tslint',
    'build.assets.dev',
    'build.scss.dev',
    'build.ts.dev',
    done));

// --------------
// Build dev watch.
gulp.task('build.dev.watch', (done: any) =>
  runSequence(
    'build.dev',
    'watch.dev',
    done));

// --------------
// Build prod.
gulp.task('build.prod', (done: any) =>
  runSequence('clean.prod',
    'tslint',
    'build.assets.prod',
    'build.html_css',
    'copy.js.prod',
    'build.js.prod',
    'build.bundles',
    'build.bundles.app',
    'build.index.prod',
    done));

// --------------
// Build test.
gulp.task('build.test', (done: any) =>
  runSequence('clean.dev',
    'tslint',
    'build.assets.dev',
    'build.js.test',
    'build.index.dev',
    done));

// --------------
// Build test watch.
gulp.task('build.test.watch', (done: any) =>
  runSequence('build.test',
    'watch.test',
    done));

// --------------
// Build tools.
gulp.task('build.tools', (done: any) =>
  runSequence('clean.tools',
    'build.js.tools',
    done));

// --------------
// Serve dev
gulp.task('serve.dev', (done: any) =>
  runSequence(
    'build.dev',
    'server.start',
    'watch.dev',
    done));

// --------------
// Serve prod
gulp.task('serve.prod', (done: any) =>
  runSequence('build.prod',
    'server.prod',
    done));

// --------------
// Test.
gulp.task('test', (done: any) =>
  runSequence('build.test',
    'karma.start',
    done));
