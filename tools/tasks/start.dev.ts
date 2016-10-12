import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as path from 'path';

import { APP_DEST, APP_SERVER } from '../config';

const plugins = <any>gulpLoadPlugins();

/**
 * Executes the build process, starts the server in dev mode and watches server code for update.
 */
export = () => {

    let stream = plugins.nodemon({
        cwd: APP_DEST,
        ext: 'ts',
        script: 'application.js',
        tasks: (changedFiles: string[]) => {
            let tasks: string[] = [];
            changedFiles.forEach((file: string) => {
                console.error(require('chalk').white.bgBlue.bold(`File change : ${path.normalize(file)}`));
                if (path.extname(file) === '.ts' && tasks.indexOf('build.server.ts.dev') === -1) {
                    tasks.push('build.server.ts.dev');
                }
            });
            return tasks;
        },
        watch: [`../../${APP_SERVER}`],
    });

    stream
        .on('start', () => {
            console.error(require('chalk').white.bgGreen.bold('Application just started'));
        })
        .on('restart', () => {
            //
        })
        .on('crash', () => {
            console.error(require('chalk').white.bgRed.bold('Application has crashed!'));
            // restart the server in 10 seconds 
            stream.emit('restart', 10);
        });
};
