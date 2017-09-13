const crypto = require('crypto');
const ObjectID = require('mongodb').ObjectID;
const speakeasy = require('speakeasy');
const { ErrorHelper, Models } = require('borderline-utils');

/**
 * @fn UserAccounts
 * @param userCollection MongoDb collection to sync against
 * @constructor
 */
function UserAccounts(userCollection) {
    this.userCollection = userCollection;

    //Bind member functions
    this.findAll = UserAccounts.prototype.findAll.bind(this);
    this.findByUsernameAndPassword = UserAccounts.prototype.findByUsernameAndPassword.bind(this);
    this.registerExternalByUsernameAndPassword = UserAccounts.prototype.registerExternalByUsernameAndPassword.bind(this);
    this.findById = UserAccounts.prototype.findById.bind(this);
    this.updateById = UserAccounts.prototype.updateById.bind(this);
    this.deleteById = UserAccounts.prototype.deleteById.bind(this);
    this.regenerateSecret = UserAccounts.prototype.regenerateSecret.bind(this);
}

/**
 * @fn findAll
 * @desc Find all the users in the server
 * @return {Promise} Resolves to an array of users on success
 */
UserAccounts.prototype.findAll = function(){
    let that = this;
    return  new Promise(function(resolve, reject) {
        that.userCollection.find().toArray().then(function(result) {
            if (result === null || result === undefined)
                reject(ErrorHelper('No users ?!'));
            else
                resolve(result);
        }, function(error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn findByUsernameAndPassword
 * @param username A string username
 * @param password A string password
 * @return {Promise} Resolves to the matched user on success
 */
UserAccounts.prototype.findByUsernameAndPassword = function(username, password) {
    let that = this;
    return new Promise(function(resolve, reject) {
        that.userCollection.findOne({username: username}).then(function(result) {
            if (result === null || result === undefined) {
                reject(ErrorHelper('Invalid username/password'));
                return;
            }
            let salt = result.salt || '';
            let hash = crypto.createHmac('sha512', salt);
            hash.update(password);
            let hash_pass = hash.digest('hex');
            if (hash_pass === result.password)
                resolve(result);
            else
                reject(ErrorHelper('Invalid username/password'));
        },
        function(error) {
            reject(ErrorHelper('Reading users db failed', error));
        });
    });
};

/**
 * @fn registerExternalByUsernameAndPassword
 * @desc Register a new user form an username/password of external source
 * @param username The username on distant source
 * @param password The password on distant source
 * @return {Promise} Resolves to the registered user on success
 */
UserAccounts.prototype.registerExternalByUsernameAndPassword = function(username, password) {
    let that = this;

    return new Promise(function(resolve, reject) {
        // Fetch default external DB here

        // Register new Borderline user on success
        let salt = crypto.randomBytes(32).toString('hex').slice(0, 32);
        let hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        let hash_pass = hash.digest('hex');
        let new_user = Object.assign({}, Models.BL_MODEL_USER, {
            username: username,
            salt: salt,
            password: hash_pass,
            secret: speakeasy.generateSecret({ length: 32, name: 'Borderline' })
        });

        // Resolve Promise on DB insert success
        that.userCollection.insertOne(new_user).then(function(result) {
            new_user._id = result.insertedId;
            resolve(new_user);
        }, function(error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn findByID
 * @param id User unique identifier reference
 * @return {Promise} Resolves to the user data on success
 */
UserAccounts.prototype.findById = function(id) {
    let that = this;
    return new Promise(function(resolve, reject) {
        that.userCollection.findOne({ _id : new ObjectID(id) }).then(function(result) {
            if (result === null || result === undefined)
                reject(ErrorHelper('No match for id: ' + id));
            else
                resolve(result);
        },
        function (error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn updateByID
 * @param id User identification reference
 * @param data new user data
 * @return {Promise} Resolves to the update user on success
 */
UserAccounts.prototype.updateById = function(id, data) {
    let that = this;
    return new Promise(function(resolve, reject) {
        if (data.hasOwnProperty('_id')) //Removes ID field because its managed by mongoDB
            delete data._id;
        //Create object from model and data
        let updated_user = Object.assign({}, Models.BL_MODEL_USER, data);
        //Perform database update
        that.userCollection.findOneAndReplace({ _id : new ObjectID(id) }, updated_user).then(function(result) {
                if (result === null || result === undefined)
                    reject(ErrorHelper('No match for id: ' + id));
                else
                    resolve(result);
            },
            function (error) {
                reject(ErrorHelper(error));
            });
    });
};

/**
 * @fn deleteById
 * @desc Removes a user from the server
 * @param id User unique identifier to
 * @return {Promise} Resolve to the removed user on success
 */
UserAccounts.prototype.deleteById = function(id) {
    let that = this;
    return new Promise(function(resolve, reject) {
        that.userCollection.findOneAndDelete({ _id : new ObjectID(id) }).then(function(result) {
            resolve(result.value);
        }, function (error) {
            reject(ErrorHelper(error));
        });
    });
};

/**
 * @fn regenerateSecret
 * @desc Regenerate the OAuth tokens and hashes for a user
 * @param id reference to the user by its unique identifier
 * @return {Promise} Resolves to the update user on success
 */
UserAccounts.prototype.regenerateSecret = function(id) {
    let that = this;
    return new Promise(function(resolve, reject) {
        that.findById(id).then(
            function (user) {
                user.secret = speakeasy.generateSecret({ length: 32, name: 'Borderline' });
                that.updateById(id, user).then(function (__unused__result) {
                    resolve(user);
                },
                function (error) {
                    reject(ErrorHelper('Update user with new secret failed', error));
                });
            },
            function (error) {
                reject(ErrorHelper('Generate secret failed', error));
            }
        );
    });
};

module.exports = UserAccounts;
