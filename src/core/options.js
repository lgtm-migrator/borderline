const path = require('path');

var Options = function(configuration) {
    this.mongoUrl = configuration.mongoUrl ? configuration.mongoUrl : 'mongodb://root:root@127.0.0.1:27020/borderline';

    this.pluginSourcesFolder = configuration.pluginSourcesFolder ? configuration.pluginSourcesFolder : './.plugins/sources';
    this.pluginFileSystemFolder = configuration.pluginFileSystemFolder ? configuration.pluginFileSystemFolder : './.plugins/filesystem';
    this.borderlineUiFolder =  configuration.borderlineUiFolder ? configuration.borderlineUiFolder : './node-modules/borderline-ui';
    this.development = configuration.development ? configuration.development : false;
};

module.exports = Options;
