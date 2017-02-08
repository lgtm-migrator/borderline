var express = require('express');
var app = express();

var BorderlineServer = require('./borderlineServer.js');

app.use(BorderlineServer({
        mongoUrl: 'mongodb://jean:root@146.169.33.32:27020/borderline',
        pluginFolder: 'C:\\Users\\grizet_j\\imperial\\borderline-server\\src\\plugins',
        pluginFileSystemFolder: 'C:\\Users\\grizet_j\\imperial\\borderline-server\\.pluginFileSystem',
        uiFolder: './node-modules/borderline-ui',
        development: true
    }
));

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
});
