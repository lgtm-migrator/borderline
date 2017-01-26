const fs = require('fs-extra');
const path = require('path');

var userAccounts = require('../core/userAccounts');

function UserAccountController(mongoDBCollection) {
    this.userCollection = mongoDBCollection;
    this.users = new userAccounts(mongoDBCollection);

    this.serializeUser = UserAccountController.prototype.serializeUser.bind(this);
    this.deserializeUser = UserAccountController.prototype.deserializeUser.bind(this);
    this.getUsers = UserAccountController.prototype.getUsers.bind(this);
    this.login = UserAccountController.prototype.login.bind(this);
    this.logout = UserAccountController.prototype.logout.bind(this);
    this.getLoginForm = UserAccountController.prototype.getLoginForm.bind(this);
    this.getUserById = UserAccountController.prototype.getUserById.bind(this);
    this.postUserById = UserAccountController.prototype.postUserById.bind(this);
    this.deleteUserById = UserAccountController.prototype.deleteUserById.bind(this);
}

UserAccountController.prototype.serializeUser = function(deserializedUser, done) {
    if (deserializedUser.hasOwnProperty('_id') == false)
        done('User has no ID', null);
    else {
        done(null,
            {
                id: deserializedUser._id,
                admin: deserializedUser.admin
            });
    }
};

UserAccountController.prototype.deserializeUser = function(serializedUser, done) {
    this.users.findById(serializedUser.id).then(function (user) {
        if (user == null)
            done('Session broke for user ID '  + serializedUser.id, null);
        else
            done(null, user);
    });
};

UserAccountController.prototype.getUsers = function(req, res, next) {
    res.status(401);
    res.json({error: 'Not implemented'});
};

UserAccountController.prototype.login = function(req, res, next) {
    var that = this;
    var rejected = function(reason) {
        res.status(401);
        res.send({ error: 'Failed to login : ' + reason.toString() });
    };

    var username = req.body.username;
    var password = req.body.password;
    if (! username || ! password) {
        rejected('Missing username or password');
        return;
    }

    this.users.findByUsernameAndPassword(username, password)
        .then(function (user) {
            return new Promise(function (resolve) {
                if (user !== null) { //Known user match
                    resolve(user);
                }
                else { //Try to find user in external DB and create in local
                    that.users.registerExternalByUsernameAndPassword(username, password).then(function (user) {
                        resolve(user);
                    }, rejected);
                }
            }, rejected);
        }, rejected)
        .then(function(user) {
            if (user === null) { //No user found in local and external
                res.status(403);
                res.json({error: 'Incorrect username/password'});
            }
            else {
                req.login(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200);
                    res.json(user);
                });
            }
        }, rejected);
};

UserAccountController.prototype.logout = function(req, res) {
    req.logout();
    res.status(200);
    res.json({ message: 'Successful logout' });
};

UserAccountController.prototype.getLoginForm = function(req, res) {
    var form =
    '<form action="/login" method="post">' +
        '<div>' +
            '<label>Username:</label>' +
            '<input type="text" name="username"/>' +
        '</div>' +
        '<div>' +
            '<label>Password:</label>' +
            '<input type="password" name="password"/>' +
        '</div>' +
        '<div>' +
            '<input type="submit" value="Log In"/>' +
        '</div>' +
    '</form>';
    res.status(200);
    res.send(form);
};

UserAccountController.prototype.getUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    this.users.findById(user_id).then(function(user) {
        if (user !== null) {
            res.status(200);
            res.json(user);
        }
        else {
            res.status(404);
            res.json({error: 'User with id: ' + user_id + 'not found' });
        }
    });
};

UserAccountController.prototype.postUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    this.users.updateById(user_id, req.body).then(function (success) {
       if (success == true) {
           res.status(200);
           res.json(req.body);
       }
       else {
           res.status(401);
           res.json({ error: 'Failed to update user with ID ' + user_id });
       }
    });
};


UserAccountController.prototype.deleteUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    this.users.deleteById(user_id).then(function (success) {
        if (success == true) {
            res.status(200);
            res.json(req.body);
        }
        else {
            res.status(401);
            res.json({ error: 'Failed to delete user with ID ' + user_id });
        }
    });
};

module.exports = UserAccountController;
