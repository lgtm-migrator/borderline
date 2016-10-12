import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import { APP_DEST, ASSETS_SRC, TEMP_FILES } from '../config';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, copying the assets.
 */
export = () => {
  let paths: string[] = [
    join(ASSETS_SRC, '**'),
    '!' + join(ASSETS_SRC, '**', '*.ts'),
    '!' + join(ASSETS_SRC, '**', '*.scss'),
  ].concat(TEMP_FILES.map((p) => { return '!' + p; }));

  return gulp.src(paths)
    .pipe(plugins.debug())
    .pipe(gulp.dest(APP_DEST));
};
