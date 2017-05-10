var express = require('express');
var app = express();

var config = require('../borderline-config.js');
var BorderlineMiddleware = require('./borderlineMiddleware.js');

//Remove unwanted express headers
app.set('x-powered-by', false);

app.use(BorderlineMiddleware(config));

app.listen(config.port, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3042/');
});
