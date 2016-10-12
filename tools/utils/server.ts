import * as express from 'express';
import * as openResource from 'open';
import { resolve } from 'path';
import * as serveStatic from 'serve-static';

import { APP_BASE, APP_DEST, COVERAGE_PORT, PORT, PROD_DEST } from '../config';

import { Application } from '../../dist/dev/application';

/**
 * Serves the Single Page Application. More specifically, calls the `listen` method, which itself launches BrowserSync.
 */
export function serve() {
  // codeChangeTool.listen();
  // serveProd();
  const server = Application.bootstrap();
  server.listen();
}

/**
 * This utility method is used to notify that a file change has happened and subsequently calls the `changed` method,
 * which itself initiates a BrowserSync reload.
 * @param {any} e - The file that has changed.
 */
export function notifyLiveReload(e: any) {
  // let fileName = e.path;
  // codeChangeTool.changed(fileName);
}
/**
 * Starts a new `express` server, serving the static unit test code coverage report.
 */
export function serveCoverage() {
  let server = express();

  server.use(
    APP_BASE,
    serveStatic(resolve(process.cwd(), 'coverage'))
  );

  server.listen(COVERAGE_PORT, () =>
    openResource('http://localhost:' + COVERAGE_PORT + APP_BASE)
  );
}

/**
 * Starts a new `express` server, serving the built files from `dist/prod`.
 */
export function serveProd() {
  let root = resolve(process.cwd(), PROD_DEST);
  let server = express();

  server.use(
    APP_BASE,
    serveStatic(root)
  );

  server.listen(PORT, () =>
    openResource('http://localhost:' + PORT + APP_BASE)
  );
};
