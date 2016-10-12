import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';
import * as runSequence from 'run-sequence';

import { SASS_SRC, TEMP_FILES, TS_SRC } from '../config';
import { notifyLiveReload } from '../utils';

const plugins = <any>gulpLoadPlugins();

/**
 * Watches the task with the given taskname.
 * @param {string} taskname - The name of the task.
 */
export function watch(taskname: string) {
  return () => {
    let paths: string[] = [
      join(SASS_SRC, '**'),
      join(TS_SRC, '**'),
    ].concat(TEMP_FILES.map((p) => { return '!' + p; }));

    plugins.watch(paths, (e: any) =>
      runSequence(taskname, () => notifyLiveReload(e))
    );
  };
}
