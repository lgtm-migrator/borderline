let express = require('express');
let app = express();

let config = require('../config/borderline.config.js');
let BorderlineServer = require('./borderlineServer.js');

//Remove unwanted express headers
app.set('x-powered-by', false);

let options = Object.assign({}, config, { development: true });
app.use(BorderlineServer(options));

app.listen(config.port, function (err) {
    if (err) {
        console.error(err); // eslint-disable-line no-console
        return;
    }

    console.log(`Listening at http://localhost:${config.port}/`); // eslint-disable-line no-console
});
