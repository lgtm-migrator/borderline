import * as fs from 'fs';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import * as config from '../config';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, copying the assets.
 */
export = () => {

  let paths: string[] = [
    join(config.APP_CLIENT, '**'),
    join(config.APP_SERVER, '**'),
    '!**/*.ts',
    '!**/*.scss',
  ].concat(config.TEMP_FILES.map((p) => { return '!' + p; }));

  let result = gulp.src(paths, { nodir: true })
    .pipe(plugins.debug())
    .pipe(gulp.dest(config.APP_DEST))
    .on('end', () => {

      let current = JSON.parse(fs.readFileSync(`${config.APP_DEST}/config.json`).toString());
      current.default = {
        base: config.APP_BASE,
        name: config.APP_NAME,
        port: config.PORT,
        version: config.APP_VERSION,
      };
      fs.writeFileSync(`${config.APP_DEST}/config.json`, JSON.stringify(current));
    });

  return result;
};
