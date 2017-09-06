const config = require('../config/borderline.config');
const request = require('request');
let TestServer = require('./testserver.js');

let testserv = new TestServer();
let current_user_id = null;

beforeAll(function() {
    return new Promise(function (resolve, reject) {
        testserv.run().then(function() {
            resolve(true);
        }, function(error) {
            reject(error.toString());
        });
    });
});

test('Login as superuser, root:root', function(done) {
   expect.assertions(4);
   request({
       method: 'POST',
       baseUrl: 'http://127.0.0.1:' + config.port,
       uri: '/login',
       json: true,
       body: {
           username: 'root',
           password: 'root'
       }
   }, function (error, response, body) {
       if (error) {
           done.fail(error.toString());
           return;
       }

       expect(response).toBeDefined();
       expect(response.statusCode).toEqual(200);
       testserv.setCookie(response);

       expect(body).toBeDefined();
       expect(body._id).toBeDefined();

       //Save login session information
       current_user_id = body._id;

       done();
   });
});

test('Check session is active for root', function(done) {
    expect.assertions(6);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/whoami',
        json: true,
        headers: {
            'Cookie': testserv.getCookie()
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        testserv.setCookie(response);

        expect(body).toBeDefined();
        expect(body._id).toBeDefined();
        expect(body._id).toEqual(current_user_id);
        expect(body.username).toEqual('root');
        done();
    });
});

test('List all users as root', function(done) {
    expect.assertions(4);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/users',
        json: true,
        headers: {
            'Cookie': testserv.getCookie()
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        testserv.setCookie(response);

        expect(body).toBeDefined();
        expect(body.length).toEqual(2);
        done();
    });
});

test('Logout root user', function(done) {
    expect.assertions(4);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/logout',
        json: true,
        headers: {
            'Cookie': testserv.getCookie()
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);

        expect(body).toBeDefined();
        expect(body.message).toBeDefined();

        testserv.clearCookie();
        current_user_id = null;
        done();
    });
});

test('Check session is closed for root', function(done) {
    expect.assertions(5);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/whoami',
        json: true,
        headers: {
            'Cookie': testserv.getCookie()
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(404);
        testserv.setCookie(response);

        expect(body).toBeDefined();
        expect(body.error).toBeDefined();
        expect(body.error).toEqual('An unknown unicorn');
        done();
    });
});

test('Login as user, user:password', function(done) {
    expect.assertions(4);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/login',
        json: true,
        body: {
            username: 'user',
            password: 'password'
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        testserv.setCookie(response);

        expect(body).toBeDefined();
        expect(body._id).toBeDefined();

        //Save login session information
        current_user_id = body._id;

        done();
    });
});


test('Check session is active for user', function(done) {
    expect.assertions(6);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/whoami',
        json: true,
        headers: {
            'Cookie': testserv.getCookie()
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        testserv.setCookie(response);

        expect(body).toBeDefined();
        expect(body._id).toBeDefined();
        expect(body._id).toEqual(current_user_id);
        expect(body.username).toEqual('user');
        done();
    });
});

test('Logout user', function(done) {
    expect.assertions(4);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/logout',
        json: true,
        headers: {
            'Cookie': testserv.getCookie()
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.message).toBeDefined();

        testserv.clearCookie();
        current_user_id = null;
        done();
    });
});

afterAll(function() {
    return new Promise(function(resolve, reject) {
        testserv.stop().then(function() {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});
