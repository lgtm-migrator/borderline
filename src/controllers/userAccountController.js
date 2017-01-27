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
        done(null, user);
    }, function(error) {
        done('Session broke: ' + error, null);
    });
};

UserAccountController.prototype.getUsers = function(req, res, next) {
   this.users.findAll().then(function(users) {
       res.status(200);
       res.json(users);
   },
   function(error) {
      res.status(401);
      res.json({ error: 'Cannot list users: ' + error});
   });
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
        .then(
            function (user) {
                return new Promise(function (resolve, reject) {
                    //Known user match
                    resolve(user);
                });
            },
            function(error) {
                return new Promise(function(resolve, reject) {
                //Try to find user in external DB and create in local
                that.users.registerExternalByUsernameAndPassword(username, password).then(function (user) {
                        resolve(user);
                    }, reject);
                });
            }
        )
        .then(function(user) {
                req.login(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200);
                    res.json(user);
                });
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
        res.status(200);
        res.json(user);
    },
    function(error) {
        res.status(404);
        res.json({error: 'Can find user by ID: '+ error });
    });
};

UserAccountController.prototype.postUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    this.users.updateById(user_id, req.body).then(function (user)
        {
            res.status(200);
            res.json(user);
        },
        function(error) {
            res.status(401);
            res.json({ error: 'Failed to update user: ' + error });
        });
};

UserAccountController.prototype.deleteUserById = function(req, res, next) {
    var user_id = req.params.user_id;

    this.users.deleteById(user_id).then(function (user)
        {
            req.logout();
            res.status(200);
            res.json({ deleted: user });
        },
        function(error) {
            res.status(401);
            res.json({ error: 'Failed to delete user: ' + error });
        });
};

module.exports = UserAccountController;
