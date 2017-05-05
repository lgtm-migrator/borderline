const request = require('request');
const ObjectID = require('mongodb').ObjectID;

function Transmart171(queryCollection) {
    this.queryCollection = queryCollection;

    //Bind member functions
    this.ensureAuthentication = Transmart171.prototype.ensureAuthentication.bind(this);
    this.needsAuthentication = Transmart171.prototype.needsAuthentication.bind(this);
    this.updateToken = Transmart171.prototype.updateToken.bind(this);
    this.saveQuery = Transmart171.prototype.saveQuery.bind(this);
    this.execute = Transmart171.prototype.execute.bind(this);

}

Transmart171.prototype.needsAuthentication = function(queryModel) {
    //Needs re-auth if Oauth token details are missing
  if (queryModel.credentials.hasOwnProperty('access_token') === false ||
      queryModel.credentials.hasOwnProperty('expires_in') === false ||
      queryModel.credentials.hasOwnProperty('generated') === false)
      return true;

  var now = new Date();
  //compute expiration date for this token
  var expires = new Date(queryModel.credentials.generated);
  expires.setTime(expires.getTime() +  queryModel.credentials['expires_in'] * 1000);

  //Compares now and expiration date
  return (now >= expires);

};

Transmart171.prototype.saveQuery = function(queryModel) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        _this.queryCollection.findOneAndReplace({_id: new ObjectID(queryModel['_id'])}, queryModel).then(function() {
            resolve(queryModel); //Good, pass the model through
        }, function(error) {
            reject(error); //DB findAndReplace fails
        })
    });
};

Transmart171.prototype.updateToken = function(queryModel) {
    return new Promise(function(resolve, reject) {
        //Get new credentials from data source
        request.post({
            method: 'POST',
            json: true,
            baseUrl: queryModel.endpoint.sourceHost + ':' + queryModel.endpoint.sourcePort,
            uri: '/oauth/token?grant_type=password&client_id=glowingbear-js&client_secret=' +
            '&username=' + queryModel.credentials.username +
            '&password=' + queryModel.credentials.password
        }, function (error, response, body) {
            if (!response) { //Reject on errors
                reject(error); return;
            }
            //Update queryModel
            var newCredentials = Object.assign({}, queryModel.credentials, body, {generated: new Date()});
            var authQuery = Object.assign({}, queryModel, {credentials: newCredentials});
            resolve(authQuery);
        });
    });
};

Transmart171.prototype.ensureAuthentication = function(queryModel) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        if (_this.needsAuthentication(queryModel) == true) {
            _this.updateToken(queryModel)
                .then(_this.saveQuery,
                    function(error) {
                        reject(error);
                })
                .then(function(result) {
                    resolve(result);
                }, function(error) {
                    reject(error);
                });
        }
        else {
            resolve(queryModel);
        }
    });
};

Transmart171.prototype.perform = function(queryModel) {
    return new Promise(function(resolve, reject) {
        request.get({
            json: true,
            baseUrl: queryModel.endpoint.sourceHost + ':' + queryModel.endpoint.sourcePort,
            uri: queryModel.query['uri'] + JSON.stringify(queryModel.query['params']),
            headers: {
               Authorization: 'Bearer ' + queryModel.credentials['access_token']
            }
        },  function(error, response, body) {
            if (!response) {
                reject(error); return;
            }
            //Success, resolve with the result data
            resolve(body);
        });
    });
};

Transmart171.prototype.execute = function(queryModel) {
    var _this = this;

    return new Promise(function(resolve, reject) {
        _this.ensureAuthentication(queryModel)
            .then(_this.perform, function(error) {
                reject(error);
            })
            .then(function(result) {
                resolve(result); //All good !
            }, function(error) {
               reject(error);
            });
    });
};

module.exports = Transmart171;