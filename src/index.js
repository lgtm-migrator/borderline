var express = require('express');
var app = express();

var BorderlineServer = require('./borderlineServer.js');

app.use(BorderlineServer({
        MongoUrl: "mongodb://jean:root@146.169.33.32:27020/borderline",
        PluginFolder: "C:\\Users\\grizet_j\\imperial\\borderline-server\\src\\plugins",
        DefaultDataSources:
            [
                {
                    "SourceName": "etricks",
                    "SourceHost": "127.0.0.1",
                    "SourcePort": 5555
                }
            ]
    }
));

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
