#!/bin/bash

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

function cleanup {
  echo 'Cleaning up.'
  # Nothing here..
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

# ******************************************************************************
# Pack borderline-scripts so we can verify they work.
# ******************************************************************************

cd packages/borderline-scripts

# Save package.json because we're going to touch it
cp package.json package.json.orig

# Replace own dependencies (those in the `packages` dir) with the local paths
# of those packages.
node $root_path/tasks/replace-own-deps.js


# Install all our packages
$root_path/node_modules/.bin/lerna bootstrap

# Finally, pack borderline-scripts
scripts_path=$root_path/packages/borderline-scripts/`npm pack`

# Restore package.json
rm package.json
mv package.json.orig package.json


# ******************************************************************************
# Now that we have packed them, call the global CLI.
# ******************************************************************************

# If Yarn is installed, clean its cache because it may have cached borderline-scripts
yarn cache clean || true

# Go back to the root directory and run the command from here
cd $root_path
node packages/borderline-create-extension/borderline-create-extension.js --scripts-version=$scripts_path "$@"

# Cleanup
cleanup
