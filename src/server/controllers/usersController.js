const fs = require('fs-extra');
const path = require('path');


//const userModule = require('../core/users');
var users = null;//new userModule();

module.exports.getUsers = function(req, res, next) {
    res.status(401);
    res.json({error: "Not implemented"});
};

module.exports.login= function(req, res, next) {

    var username = req.params.username;
    var password = req.params.password;

    var user = {id: 42, email: "", name: "zirg" };//users.login(username, password);
    //If is user's first login
    if (user === null)
        user = users.firstLogin(username, password);

    //Not a valid username/password
    if (user === null) {
        res.status(403);
        res.json({ error: 'Incorrect username/password' });
    }
    else {
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            res.status(200);
            res.json(user);
        });
    }
};

module.exports.logout = function(req, res) {
    req.logout();
    res.status(200);
    res.json({ message: "Successful logout" });
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
    var id = req.params.id;
    res.status(401);
    res.json({error: "Not implemented"});
};

module.exports.postUserById = function(req, res, next) {
    var id = req.params.id;
    res.status(401);
    res.json({error: "Not implemented"});
};


module.exports.deleteUserById = function(req, res, next) {
    var id = req.params.id;
    res.status(401);
    res.json({error: "Not implemented"});
};
