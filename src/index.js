let express = require('express');
let os = require('os');
let config = require('../config/borderline.config.js');
let BorderlineServer = require('./borderlineServer.js');

let web_app = express();
let borderline_server = new BorderlineServer(config);

borderline_server.start().then(function(borderline_router) {
    // Remove unwanted express headers
    web_app.set('x-powered-by', false);
    web_app.use(borderline_router);
    web_app.listen(config.port, function (error) {
        if (error) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
}, function(error) {
    console.error(error); // eslint-disable-line no-console
});

