import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';

import { BORDERLINE_TASKS_DIR } from './tools/config';
import { loadTasks } from './tools/utils';

loadTasks(BORDERLINE_TASKS_DIR);

gulp.task('build.dev', (done: any) =>
  runSequence(
    'clean.dev',
    // 'tslint',
    'build.assets.dev',
    'build.client.scss.dev',
    'build.client.ts.dev',
    'build.server.ts.dev',
    done));

gulp.task('serve.dev', (done: any) =>
  runSequence(
    'build.dev',
    'start.dev',
    done));

gulp.task('watch.client.dev', (done: any) =>
  runSequence(
    'watch.assets.dev',
    'watch.client.scss.dev',
    'watch.client.ts.dev',
    done));
