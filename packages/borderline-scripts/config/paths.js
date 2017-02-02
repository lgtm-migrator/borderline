// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
// @remove-on-eject-end

var path = require('path');
var fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.

// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders

// We will export `nodePaths` as an array of absolute paths.
// It will then be used by Webpack configs.
// Jest doesn’t need this because it already handles `NODE_PATH` out of the box.

// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421

var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(function(folder)  { return !path.isAbsolute(folder) } )
  .map(resolveApp);

// config after eject: we're in ./config/
module.exports = {
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public-extension'),
    appHtml: resolveApp('public-extension/index.html'),
    uiIndexJs: resolveApp('ui-extension/index.js'),
    uiSrc: resolveApp('ui-extension'),
    serverIndexJs: resolveApp('server-extension/index.js'),
    serverSrc: resolveApp('server-extension'),

    appPackageJson: resolveApp('package.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    appNodeModules: resolveApp('node_modules'),
    ownNodeModules: resolveOwn('node_modules'),
    nodePaths: nodePaths
};

// @remove-on-eject-begin
function resolveOwn(relativePath) {
  return path.resolve(__dirname, relativePath);
}

// config before eject: we're in ./node_modules/borderline-scripts/config/
module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public-extension'),
  appHtml: resolveApp('public-extension/index.html'),
  uiIndexJs: resolveApp('ui-extension/index.js'),
  uiSrc: resolveApp('ui-extension'),
  serverIndexJs: resolveApp('server-extension/index.js'),
  serverSrc: resolveApp('server-extension'),

  appPackageJson: resolveApp('package.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveOwn('../node_modules'),
  nodePaths: nodePaths
};

// config before publish: we're in ./packages/borderline-scripts/config/
if (__dirname.indexOf(path.join('packages', 'borderline-scripts', 'config')) !== -1) {
  module.exports = {
      appBuild: resolveApp('../../../build'),
      appPublic: resolveApp('../template/public-extension'),
      appHtml: resolveApp('../template/public-extension/index.html'),
      uiIndexJs: resolveApp('../template/ui-extension/index.js'),
      uiSrc: resolveApp('../template/ui-extension'),
      serverIndexJs: resolveApp('../template/server-extension/index.js'),
      serverSrc: resolveApp('../template/server-extension'),

      appPackageJson: resolveApp('../package.json'),
      yarnLockFile: resolveApp('../template/yarn.lock'),
      appNodeModules: resolveApp('../node_modules'),
      ownNodeModules: resolveOwn('../node_modules'),
      nodePaths: nodePaths
  };
}
// @remove-on-eject-end
