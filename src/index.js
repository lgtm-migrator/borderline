var express = require('express');
var app = express();

var BorderlineServer = require('./borderlineServer.js');

//Remove unwanted express headers
app.set('x-powered-by', false);

app.use(BorderlineServer({
        mongoUrl: 'mongodb://jean:root@146.169.33.32:27020/borderline',
        pluginSourcesFolder: 'C:\\Users\\grizet_j\\imperial\\borderline-server\\.plugins\\sources',
        pluginFileSystemFolder: 'C:\\Users\\grizet_j\\imperial\\borderline-server\\.plugins\\filesystem',
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
