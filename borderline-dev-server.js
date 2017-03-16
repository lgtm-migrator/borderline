var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var spawn = require('cross-spawn');
var express = require('express');

var config = require('./borderline-dev-config.json');

//Creating webpack processes to compile extensions
var extensions = fs.readdirSync(config.pluginSourcesFolder);
for (var i = 0; i < extensions.length; i++) {
    var extensionDirectory = path.join(config.pluginSourcesFolder, extensions[i]);
    console.log(extensionDirectory);

    //Navigate to extension dir
    process.chdir(extensionDirectory);

    //Run npm build command from extension dir
    var build_proc = spawn('npm', ['run', 'build-dev'], {stdio: 'inherit'});
    build_proc.on('close', function (exitCode) {
        if (exitCode !== 0) {
            console.log(chalk.red('Install package dependencies failed'));
            process.exit(1);
        }
        else {
            console.log(chalk.green('Exiting webpack watcher'));
            process.exit(0);
        }
    });

    //Back to root directory
    process.chdir(__dirname);
}

//Creating express server
var app = express();
var BorderlineServer = require('borderline-server');
//Remove unwanted express headers
app.set('x-powered-by', false);
//Use Borderline server in dev mode
app.use(BorderlineServer({
        mongoUrl: config.mongoUrl,
        pluginSourcesFolder: config.pluginBuildFolder,
        pluginFileSystemFolder: config.pluginFileSystemFolder,
        development: true
    }
));
//Listen on config port
app.listen(config.port, function (err) {
    if (err) {
        return console.error(chalk.red(err));
    }

    console.log(chalk.green('Listening at http://localhost:' + config.port.toString()));
});
