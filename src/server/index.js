//External node module imports
var path = require('path');
var webpack = require('webpack');
var express = require('express');
var expressSession = require('express-session');
var body_parser = require('body-parser');
var devMiddleware = require('webpack-dev-middleware');
var hotMiddleware = require('webpack-hot-middleware');
var config = require('../../webpack.config');
var app = express();
var compiler = webpack(config);
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
var multer  = require('multer');

//Configuration import
global.config = require('./config.json');


//Controllers imports
var pluginStoreController = require('./controllers/pluginStoreController');
var usersController = require('./controllers/usersController');

//Setting up middlewares
app.use(devMiddleware(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: {
        colors: true
    },
}));
app.use(hotMiddleware(compiler));
app.use(body_parser.json());
app.use(expressSession({ secret: 'borderline', saveUninitialized: false, resave: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersController.serializeUser);
passport.deserializeUser(usersController.deserializeUser);

//[ Login and sessions Routes
//TEMPORARY getter on login form
app.get('/login/form', usersController.getLoginForm); //GET login form

app.route('/login')
    .post(usersController.login); //POST login information
app.route('/logout')
    .post(usersController.logout); //POST logout from session
app.route('/users')
    .get(usersController.getUsers);//GET returns the list of users
app.route('/users/:id')
    .get(usersController.getUserById) //GET user details by ID
    .post(usersController.postUserById) //POST Update user details
    .delete(usersController.deleteUserById); //DELETE Removes a user
// ] Login and sessions routes

// [ Plugin Store Routes
//TEMPORARY getter on a form to upload plugins zip file
app.get("/plugin_store/upload", pluginStoreController.getPluginStoreUpload);
//TEMPORARY getter on a form to update plugins zip file
app.get("/plugin_store/upload/:id", pluginStoreController.getPluginStoreUploadByID);

app.use("/plugins", pluginStoreController.getPluginStoreRouter()); //Plugins routers connect here
app.route('/plugin_store')
    .get(pluginStoreController.getPluginStore) //GET returns the list of available plugins
    .post(multer().any(), pluginStoreController.postPluginStore) //POST upload a new plugin
    .delete(pluginStoreController.deletePluginStore); //DELETE clears all the plugins
app.route('/plugin_store/:id')
    .get(pluginStoreController.getPluginByID) //:id GET returns plugin metadata
    .post(multer().any(), pluginStoreController.postPluginByID) //:id POST update a plugin content
    .delete(pluginStoreController.deletePluginByID); //:id DELETE removes a specific plugin
// ] Plugin Store Routes


app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
});
