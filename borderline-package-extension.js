var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var spawn = require('cross-spawn');
var archiver = require('archiver');

var config = require('./borderline-dev-config.json');

//Cleanups previous dev environments
fs.emptyDirSync(config.pluginBuildFolder);
fs.emptyDirSync(config.pluginPackageFolder);

//Creating webpack processes to compile extensions
var extensions = fs.readdirSync(config.pluginSourcesFolder);
for (var i = 0; i < extensions.length; i++) {
    var extensionDirectory = path.resolve(path.join(config.pluginSourcesFolder, extensions[i]));

    //Navigate to extension dir
    process.chdir(extensionDirectory);

    //Run npm build command from extension dir
    var build_proc = spawn('npm', ['run', 'build-prod'], {stdio: 'inherit'});
    build_proc.on('close', function (exitCode) {
        if (exitCode !== 0) {
            console.log(chalk.red('Build package failed'));
            process.exit(1);
        }
        else {
            console.log(chalk.green('Webpack bundling successful'));

            var buildTrace = fs.readJSONSync(path.join(extensionDirectory, '.build.json'));
            var buildDirectory = path.join(config.pluginBuildFolder, buildTrace.id);
            var packageName = buildTrace.name + '-' + buildTrace.version;
            var packageTarget = path.join(config.pluginPackageFolder, packageName) + '.zip';

            var output = fs.createWriteStream(packageTarget);
            var zipArchive = archiver('zip');
            zipArchive.pipe(output);
            zipArchive.directory(buildDirectory, buildTrace.id);
            zipArchive.finalize();
            output.on('close', function() {
                console.log(chalk.green('Written package ' + packageName + '.zip'));
                process.exit(0);
            });
            output.on('error', function(err) {
                console.log(chalk.red('Writting package ' + packageName + '.zip failed: ' + err));
                process.exit(1);
            })
        }
    });

    //Back to root directory
    process.chdir(__dirname);
}
