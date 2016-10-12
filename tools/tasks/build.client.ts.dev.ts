import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as merge from 'merge-stream';
import { join } from 'path';

import { JS_DEST, TS_SRC } from '../config';
import { makeTsProject, templateLocals } from '../utils';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, transpiling the TypeScript files (except the spec and e2e-spec files) for the development
 * environment.
 */
export = () => {

  let tsProject = makeTsProject();
  let typings = gulp.src([
    'typings/index.d.ts',
    'typings/customs/*.d.ts',
  ]);

  let src = [
    join(TS_SRC, '**/*.ts'),
    '!' + join(TS_SRC, '**/*.spec.ts'),
    '!' + join(TS_SRC, '**/*.e2e-spec.ts'),
  ];

  let projectFiles = gulp.src(src)
    .pipe(plugins.debug())
    .pipe(plugins.cached());

  let result = merge(typings, projectFiles)
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(tsProject());

  return result.js
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.template(templateLocals()))
    .pipe(gulp.dest(JS_DEST));
};
