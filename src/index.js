var express = require('express');
var app = express();

var BorderlineServer = require('./borderlineServer.js');

app.use(new BorderlineServer());

app.get('*', function (req, res) {
    res.status(404);
    res.send({error: '404 Not found'});
});

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
});
