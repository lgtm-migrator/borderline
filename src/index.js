let express = require('express');
let app = express();

let config = require('../config/borderline.config.js');
let BorderlineMiddleware = require('./borderlineMiddleware.js');

//Remove unwanted express headers
app.set('x-powered-by', false);

let middleware = new BorderlineMiddleware(config);
middleware.start().then(function (middlware_router) {
    app.use(middlware_router);
    app.listen(config.port, function (err) {
        if (err) {
            return console.error(err); // eslint-disable-line no-console
        }
        console.log(`Listening at http://localhost:${config.port}/`); // eslint-disable-line no-console
    });
}, function (error) {
    console.error(error); // eslint-disable-line no-console
});

