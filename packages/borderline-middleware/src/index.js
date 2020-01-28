let express = require('express');
let os = require('os');
let config = require('../config/borderline.config.js');
let BorderlineMiddleware = require('./borderlineMiddleware.js');

let web_app = express();
let middleware = new BorderlineMiddleware(config);

middleware.start().then(function (middlware_router) {
    // Remove unwanted express headers
    web_app.set('x-powered-by', false);
    web_app.use(middlware_router);
    web_app.listen(config.port, function (error) {
        if (error) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
}, function (error) {
    console.error(error); // eslint-disable-line no-console
});
