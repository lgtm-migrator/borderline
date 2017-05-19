var express = require('express');
var app = express();

var config = require('../config/borderline.config.js');
var BorderlineServer = require('./borderlineServer.js');

//Remove unwanted express headers
app.set('x-powered-by', false);

var options = Object.assign({}, config, { development: true });
app.use(BorderlineServer(options));

app.listen(config.port, function (err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(`Listening at http://localhost:${config.port}/`);
});
