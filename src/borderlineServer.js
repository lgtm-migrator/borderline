//External node module imports
var path = require('path');
var express = require('express');
var expressSession = require('express-session');
var body_parser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
var multer  = require('multer');

var BorderlineServer = function() {
    this.app = express();

    //Configuration import
    global.config = require('./borderlineServer.json');

    //Middleware imports
    this.userPermissionsMiddleware = require('./middlewares/userPermissions');

    //Controller imports
    this.pluginStoreController = require('./controllers/pluginStoreController');
    this.userAccountController = require('./controllers/userAccountController');
    this.userDataSourcesController = require('./controllers/userDataSourcesController');

    //Init external middleware
    this.app.use(body_parser.json());
    this.app.use(expressSession({ secret: 'borderline', saveUninitialized: false, resave: false }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.serializeUser(this.userAccountController.serializeUser);
    passport.deserializeUser(this.userAccountController.deserializeUser);

    //[ Login and sessions Routes
    //TEMPORARY getter on login form
    this.app.get('/login/form', this.userAccountController.getLoginForm); //GET login form

    this.app.route('/login')
        .post(this.userAccountController.login); //POST login information
    this.app.route('/logout')
        .post(this.userAccountController.logout); //POST logout from session
    this.app.route('/users')
        .get(this.userPermissionsMiddleware.adminPrivileges, this.userAccountController.getUsers);//GET returns the list of users
    this.app.route('/users/:user_id')
        .get(this.userAccountController.getUserById) //GET user details by ID
        .post(this.userAccountController.postUserById) //POST Update user details
        .delete(this.userAccountController.deleteUserById); //DELETE Removes a user
    // ] Login and sessions routes

    //[ Data sources routes
    this.app.route('/users/:user_id/data_source')
        .get(this.userDataSourcesController.getDataSources)
        .post(this.userDataSourcesController.postDataSources)
        .delete(this.userDataSourcesController.deleteDataSources)
        .put(this.userDataSourcesController.putDataSources);
    this.app.route('/users/:user_id/data_source/:data_source_id')
        .get(this.userDataSourcesController.getUserDataSource)
        .delete(this.userDataSourcesController.deleteUserDataSource)
        .post(this.userDataSourcesController.postUserDataSource);
    // ] Data sources routes

    // [ Plugin Store Routes
    //TEMPORARY getter on a form to upload plugins zip file
    this.app.get('/plugin_store/upload', this.pluginStoreController.getPluginStoreUpload);
    //TEMPORARY getter on a form to update plugins zip file
    this.app.get('/plugin_store/upload/:id', this.pluginStoreController.getPluginStoreUploadByID);

    this.app.use('/plugins', this.pluginStoreController.getPluginStoreRouter()); //Plugins routers connect here
    this.app.route('/plugin_store')
        .get(this.pluginStoreController.getPluginStore) //GET returns the list of available plugins
        .post(multer().any(), this.pluginStoreController.postPluginStore) //POST upload a new plugin
        .delete(this.pluginStoreController.deletePluginStore); //DELETE clears all the plugins
    this. app.route('/plugin_store/:id')
        .get(this.pluginStoreController.getPluginByID) //:id GET returns plugin metadata
        .post(multer().any(), this.pluginStoreController.postPluginByID) //:id POST update a plugin content
        .delete(this.pluginStoreController.deletePluginByID); //:id DELETE removes a specific plugin
    // ] Plugin Store Routes

    return this.app;
};

module.exports = BorderlineServer;
