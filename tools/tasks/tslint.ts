import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import { TOOLS_DIR, TS_SRC } from '../config';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, linting the TypeScript files using `codelyzer`.
 */
export = () => {
  let src = [
    join(TS_SRC, '**/*.ts'),
    '!' + join(TS_SRC, '**/*.d.ts'),
    join(TOOLS_DIR, '**/*.ts'),
    '!' + join(TOOLS_DIR, '**/*.d.ts'),
  ];

  return gulp.src(src)
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report(require('tslint-stylish'), {
      bell: true,
      emitError: require('is-ci'),
      sort: true,
    }));
};
