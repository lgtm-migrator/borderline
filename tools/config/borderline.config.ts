import { join } from 'path';
import { argv } from 'yargs';

import { IEnvironments } from './borderline.config.interfaces';

/**
 * The enumeration of available environments.
 * @type {IEnvironments}
 */
export const ENVIRONMENTS: IEnvironments = {
  DEVELOPMENT: 'dev',
  PRODUCTION: 'prod',
};

/**
 * This class represents the basic configuration of the borderline.
 * It provides the following:
 * - Constants for directories, ports, versions etc.
 * - Injectable NPM dependencies
 * - Injectable application assets
 * - Temporary editor files to be ignored by the watcher and asset builder
 * - SystemJS configuration
 * - Autoprefixer configuration
 * - BrowserSync configuration
 * - Utilities
 */
export class BorderlineConfig {

  /**
   * The port where the application will run.
   * The default port is `5555`, which can be overriden by the  `--port` flag when running `npm start`.
   * @type {number}
   */
  public PORT = argv.port || 5555;

  /**
   * The port where the unit test coverage report application will run.
   * The default coverage port is `4004`, which can by overriden by the `--coverage-port` flag when running `npm start`.
   * @type {number}
   */
  public COVERAGE_PORT = argv['coverage-port'] || 4004;

  /**
   * The root folder of the project (up two levels from the current directory).
   */
  public PROJECT_ROOT = join(__dirname, '../..');

  /**
   * The current environment.
   * The default environment is `dev`, which can be overriden by the `--env` flag when running `npm start`.
   */
  public ENV = getEnvironment();

  /**
   * The default title of the application as used in the `<title>` tag of the
   * `index.html`.
   * @type {string}
   */
  public APP_NAME = 'Borderline';

  /**
   * The version of the application as defined in the `package.json`.
   */
  public APP_VERSION = appVersion();

  /**
   * The path for the base of the application at runtime.
   * The default path is `/`, which can be overriden by the `--base` flag when running `npm start`.
   * @type {string}
   */
  public APP_BASE = argv.base || '/';

  /**
   * The base folder of the applications source files.
   * @type {string}
   */
  public APP_SOURCE = `sources`;

  /**
   * The directory where the client files are located.
   * The default directory is `client`.
   * @type {string}
   */
  public APP_CLIENT = `${this.APP_SOURCE}/client`;

  /**
   * The directory where the server files are located.
   * The default directory is `server`.
   * @type {string}
   */
  public APP_SERVER = `${this.APP_SOURCE}/server`;

  /**
   * The base folder for built files.
   * @type {string}
   */
  public DIST_DIR = 'dist';

  /**
   * The folder for built files in the `dev` environment.
   * @type {string}
   */
  public DEV_DEST = `${this.DIST_DIR}/dev`;

  /**
   * The folder for the built files in the `prod` environment.
   * @type {string}
   */
  public PROD_DEST = `${this.DIST_DIR}/prod`;

  /**
   * The folder for temporary files.
   * @type {string}
   */
  public TMP_DIR = `${this.DIST_DIR}/tmp`;

  /**
   * The folder for the built files, corresponding to the current environment.
   * @type {string}
   */
  public APP_DEST = this.ENV === ENVIRONMENTS.DEVELOPMENT ? this.DEV_DEST : this.PROD_DEST;

  /**
   * The base folder of the applications static files.
   * @type {string}
   */
  public APP_STATIC = `${this.APP_DEST}/public`;

  /**
   * The folder of the applications scss files.
   * @type {string}
   */
  public SASS_SRC = `${this.APP_CLIENT}/styles`;

  /**
   * The folder of the applications ts files.
   * @type {string}
   */
  public TS_SRC = `${this.APP_CLIENT}/styles`;

  /**
   * The folder for the built CSS files.
   * @type {strings}
   */
  public CSS_DEST = `${this.APP_STATIC}/css`;

  /**
   * The folder for the built JavaScript files.
   * @type {string}
   */
  public JS_DEST = `${this.APP_STATIC}/js`;

  /**
   * The name of the bundle file to includes all CSS files.
   * @type {string}
   */
  public CSS_PROD_BUNDLE = 'borderline.css';

  /**
   * The name of the bundle file to include all JavaScript application files.
   * @type {string}
   */
  public JS_PROD_BUNDLE = 'borderline.js';

  /**
   * The directory of the applications tools
   * @type {string}
   */
  public TOOLS_DIR = 'tools';

  /**
   * The directory of the tasks provided by the borderline.
   */
  public BORDERLINE_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks');

  /**
   * The bootstrap file to be used to boot the application. 
   * @type {string}
   */
  public BOOTSTRAP = `${this.APP_SERVER}/` + 'app';

  /**
   * The required NPM version to run the application.
   * @type {string}
   */
  public VERSION_NPM = '3.10.8';

  /**
   * The required NodeJS version to run the application.
   * @type {string}
   */
  public VERSION_NODE = '6.4.0';

  /**
   * The list of editor temporary files to ignore in watcher and asset builder.
   * @type {string[]}
   */
  public TEMP_FILES: string[] = [
    '**/*___jb_tmp___',
    '**/#~#',
    '**/*~',
  ];

  /**
   * The Autoprefixer configuration for the application.
   * @type {Array}
   */
  public BROWSER_LIST = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10',
  ];

}

/**
 * Returns the applications version as defined in the `package.json`.
 * @return {number} The applications version.
 */
function appVersion(): number | string {
  let pkg = require('../../package.json');
  return pkg.version;
}

/**
 * Returns the environment of the application.
 */
function getEnvironment() {
  let base: string[] = argv._;
  let prodKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.PRODUCTION) >= 0).pop();
  let env = (argv.env || '').toLowerCase();
  if ((base && prodKeyword) || env === ENVIRONMENTS.PRODUCTION) {
    return ENVIRONMENTS.PRODUCTION;
  } else {
    return ENVIRONMENTS.DEVELOPMENT;
  }
}
