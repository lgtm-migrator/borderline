import * as autoprefixer from 'autoprefixer';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import { BROWSER_LIST, CSS_DEST, SASS_SRC, TEMP_FILES } from '../config';

const plugins = <any>gulpLoadPlugins();
const processors = [
  autoprefixer({
    browsers: BROWSER_LIST,
  }),
];

/**
 * Executes the build process, compiling and copying the saas files located.
 */
export = () => {
  let paths: string[] = [
    join(SASS_SRC, '**'),
  ].concat(TEMP_FILES.map((p) => { return '!' + p; }));

  return gulp.src(paths)
    .pipe(plugins.debug())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.postcss(processors))
    .pipe(gulp.dest(CSS_DEST));
};
