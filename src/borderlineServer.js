//External node module imports
var mongodb = require('mongodb').MongoClient;
var path = require('path');
var express = require('express');
var expressSession = require('express-session');
var body_parser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
var multer  = require('multer');

function BorderlineServer() {
    this.app = express();

    //Configuration import
    global.config = require('./borderlineServer.json');

    var that = this;
    mongodb.connect(global.config.MongoUrl, function(err, db) {
        if (err !== null) {
          console.log(err);
          return;
        }

        //Middleware imports
        that.userPermissionsMiddleware = require('./middlewares/userPermissions');

        //Controller imports
        var userAccountController = require('./controllers/userAccountController');
        that.userAccountController = new userAccountController(db.collection('users'));

        var pluginStoreController = require('./controllers/pluginStoreController');
        that.pluginStoreController = new pluginStoreController();

        var userDataSourcesController = require('./controllers/userDataSourcesController');
        that.userDataSourcesController = new userDataSourcesController(db.collection('users'));



        //Init external middleware
        that.app.use(body_parser.urlencoded({ extended: true }));
        that.app.use(body_parser.json());
        that.app.use(expressSession({ secret: 'borderline', saveUninitialized: false, resave: false }));
        that.app.use(passport.initialize());
        that.app.use(passport.session());
        passport.serializeUser(that.userAccountController.serializeUser);
        passport.deserializeUser(that.userAccountController.deserializeUser);

        //[ Login and sessions Routes
        //TEMPORARY getter on login form
        that.app.get('/login/form', that.userAccountController.getLoginForm); //GET login form

        that.app.route('/login')
            .post(that.userAccountController.login); //POST login information
        that.app.route('/logout')
            .post(that.userAccountController.logout); //POST logout from session
        that.app.route('/users')
            .get(that.userPermissionsMiddleware.adminPrivileges, that.userAccountController.getUsers);//GET returns the list of users
        that.app.route('/users/:user_id')
            .get(that.userAccountController.getUserById) //GET user details by ID
            .post(that.userAccountController.postUserById) //POST Update user details
            .delete(that.userAccountController.deleteUserById); //DELETE Removes a user
        // ] Login and sessions routes

        //[ Data sources routes
        that.app.route('/users/:user_id/data_source')
            .get(that.userDataSourcesController.getDataSources)
            .post(that.userDataSourcesController.postDataSources)
            .delete(that.userDataSourcesController.deleteDataSources)
            .put(that.userDataSourcesController.putDataSources);
        that.app.route('/users/:user_id/data_source/:data_source_id')
            .get(that.userDataSourcesController.getUserDataSource)
            .delete(that.userDataSourcesController.deleteUserDataSource)
            .post(that.userDataSourcesController.postUserDataSource);
        // ] Data sources routes

        // [ Plugin Store Routes
        //TEMPORARY getter on a form to upload plugins zip file
        that.app.get('/plugin_store/upload', that.pluginStoreController.getPluginStoreUpload);
        //TEMPORARY getter on a form to update plugins zip file
        that.app.get('/plugin_store/upload/:id', that.pluginStoreController.getPluginStoreUploadByID);

        that.app.use('/plugins', that.pluginStoreController.getPluginStoreRouter()); //Plugins routers connect here
        that.app.route('/plugin_store')
            .get(that.pluginStoreController.getPluginStore) //GET returns the list of available plugins
            .post(multer().any(), that.pluginStoreController.postPluginStore) //POST upload a new plugin
            .delete(that.pluginStoreController.deletePluginStore); //DELETE clears all the plugins
        that.app.route('/plugin_store/:id')
            .get(that.pluginStoreController.getPluginByID) //:id GET returns plugin metadata
            .post(multer().any(), that.pluginStoreController.postPluginByID) //:id POST update a plugin content
            .delete(that.pluginStoreController.deletePluginByID); //:id DELETE removes a specific plugin
        // ] Plugin Store Routes
    });

    return this.app;
};

module.exports = BorderlineServer;
