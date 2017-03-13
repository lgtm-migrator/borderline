#!/bin/bash

function cleanup {
  echo 'Cleaning up build process'
  # Nothing here..
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting build with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting build without error.' 1>&2;
  exit
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Run the setup script
node borderline-build-extension.js "$@"
echo "Press any key to exit..."
read -n 1
