//External node module imports
var path = require('path');
var express = require('express');
var expressSession = require('express-session');
var body_parser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
var multer  = require('multer');

var app = express();

//Configuration import
global.config = require('./config.json');

//Controllers imports
var pluginStoreController = require('./controllers/pluginStoreController');
var userAccountController = require('./controllers/userAccountController');
var userDataSourcesController = require('./controllers/userDataSourcesController');

//Setting up middlewares
var userPermissions = require('./middlewares/userPermissions');

app.use(body_parser.json());
app.use(expressSession({ secret: 'borderline', saveUninitialized: false, resave: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userAccountController.serializeUser);
passport.deserializeUser(userAccountController.deserializeUser);

//[ Login and sessions Routes
//TEMPORARY getter on login form
app.get('/login/form', userAccountController.getLoginForm); //GET login form

app.route('/login')
    .post(userAccountController.login); //POST login information
app.route('/logout')
    .post(userAccountController.logout); //POST logout from session
app.route('/users')
    .get(userPermissions.adminPrivileges, userAccountController.getUsers);//GET returns the list of users
app.route('/users/:user_id')
    .get(userAccountController.getUserById) //GET user details by ID
    .post(userAccountController.postUserById) //POST Update user details
    .delete(userAccountController.deleteUserById); //DELETE Removes a user
// ] Login and sessions routes

//[ Data sources routes
app.route('/users/:user_id/data_source')
    .get(userDataSourcesController.getDataSources)
    .post(userDataSourcesController.postDataSources)
    .delete(userDataSourcesController.deleteDataSources)
    .put(userDataSourcesController.putDataSources);
app.route('/users/:user_id/data_source/:data_source_id')
    .get(userDataSourcesController.getUserDataSource)
    .delete(userDataSourcesController.deleteUserDataSource)
    .post(userDataSourcesController.postUserDataSource);
// ] Data sources routes

// [ Plugin Store Routes
//TEMPORARY getter on a form to upload plugins zip file
app.get('/plugin_store/upload', pluginStoreController.getPluginStoreUpload);
//TEMPORARY getter on a form to update plugins zip file
app.get('/plugin_store/upload/:id', pluginStoreController.getPluginStoreUploadByID);

app.use('/plugins', pluginStoreController.getPluginStoreRouter()); //Plugins routers connect here
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
    res.status(404);
    res.send({error: 'Not found'});
});

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
});
