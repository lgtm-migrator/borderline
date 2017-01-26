const fs = require('fs-extra');
const path = require('path');

const userAccountModule = require('../core/userAccounts');
var users = new userAccountModule();

module.exports.serializeUser = function(deserializedUser, done) {
    if (deserializedUser.hasOwnProperty('id') == false)
        done('User has no ID', null);
    else {
        done(null,
            {
                id: deserializedUser.id,
                admin: deserializedUser.admin
            });
    }
};

module.exports.deserializeUser = function(serializedUser, done) {
    users.findById(serializedUser.id).then(function (user) {
        if (user == null)
            done('Session broke for user ID '  + serializedUser.id, null);
        else
            done(null, user);
    });
};

module.exports.getUsers = function(req, res, next) {
    res.status(401);
    res.json({error: 'Not implemented'});
};

module.exports.login = function(req, res, next) {

    var username = req.params.username;
    var password = req.params.password;

    users.findByUsernameAndPassword(username, password)
        .then(function (user) {
            return new Promise(function (resolve) {
                if (user !== null) { //Known user match
                    resolve(user);
                }
                else { //Try to find user in external DB and create in local
                    users.registerExternalByUsernameAndPassword(username, password).then(function (user) {
                        resolve(user);
                    });
                }
            });
        })
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
        });
};

module.exports.logout = function(req, res) {
    req.logout();
    res.status(200);
    res.json({ message: 'Successful logout' });
};

module.exports.getLoginForm = function(req, res) {
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

module.exports.getUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    users.findById(user_id).then(function(user) {
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

module.exports.postUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    users.updateById(user_id, req.body).then(function (success) {
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


module.exports.deleteUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    users.deleteById(user_id).then(function (success) {
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
