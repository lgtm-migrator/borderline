const request = require('request');
const ObjectID = require('mongodb').ObjectID;

function Transmart171(queryCollection) {
    this.queryCollection = queryCollection;

    //Bind member functions
    this.getToken = Transmart171.prototype.getToken.bind(this);
    this.saveQuery = Transmart171.prototype.saveQuery.bind(this);
    this.execute = Transmart171.prototype.execute.bind(this);

}

Transmart171.prototype.saveQuery = function(queryModel) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.queryCollection.findOneAndReplace({_id: new ObjectID(queryModel['_id'])}, queryModel).then(function() {
            resolve(queryModel);
        }, function(error) {
            reject(error);
        })
    });
};

Transmart171.prototype.getToken = function(queryModel) {
    return new Promise(function(resolve, reject) {
        //Get new credentials
        request.post({
            method: 'POST',
            json: true,
            baseUrl: queryModel.endpoint.sourceHost + ':' + queryModel.endpoint.sourcePort,
            uri: '/oauth/token?grant_type=password&client_id=glowingbear-js&client_secret=' +
            '&username=' + queryModel.credentials.username +
            '&password=' + queryModel.credentials.password
        }, function (error, response, body) {
            if (!response) {
                reject(error);
                return;
            }
            console.log('TS17.1 authentication: ');
            console.log(body);
            var newCredentials = Object.assign({}, queryModel.credentials, body);
            var authQuery = Object.assign({}, queryModel, {credentials: newCredentials});
            resolve(authQuery);
        });
    });
};

Transmart171.prototype.execute = function(queryModel) {
    var _this = this;

    return new Promise(function(resolve, reject) {
        _this.getToken(queryModel).then(function(queryModel) {
            resolve(queryModel);
        }, function(error) {
            reject(error);
        })
    });
};

module.exports = Transmart171;