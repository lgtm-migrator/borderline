/**
 * @fn Options
 * @param configuration JS configuration object
 * @desc Complete the configuration object with default values
 * @constructor
 */
var Options = function(configuration) {
    this.mongoURL = configuration.mongoURL ? configuration.mongoURL : 'mongodb://root:root@127.0.0.1:27020/borderline';
    this.objectStorageUrl = configuration.objectStorageUrl ? configuration.objectStorageUrl : 'mongodb://root:root@127.0.0.1:27020/borderlineobject';
    this.port = configuration.port ? configuration.port : 8081;
    this.enableCors  = configuration.enableCors ? configuration.enableCors : true;
};

module.exports = Options;