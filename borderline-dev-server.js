var express = require('express');
var app = express();

var BorderlineServer = require('borderline-server');

var config = require('./borderline-config.json');

//Remove unwanted express headers
app.set('x-powered-by', false);

app.use(BorderlineServer({
        mongoUrl: config.mongo,
        development: true
    }
));

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
});
