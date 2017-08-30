const request = require('request');
const TestServer = require('./testserver.js');
let config = require('../config/borderline.config.js');


let test_server = new TestServer();
let g_query_id = '';

beforeAll(function() {
    return new Promise(function (resolve, reject) {
        test_server.start(config).then(function() {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});

test('Create stub TS171 query, save the id as ref', function(done) {
    expect.assertions(6);
    request(
        {
            method: 'POST',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/new/TS171',
            json: true,
            body: {
                stubProperty: false
            }
        }, function (error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            expect(body).toBeDefined();
            expect(body.status).toBeDefined();
            expect(body.status.status).toEqual('unknown');
            expect(body._id).toBeDefined();
            g_query_id = body._id;
            done();
        }
    );
});

test('Get {query_id} credentials, check type fields username and password are present', function(done) {
    expect.assertions(4);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/credentials',
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        if (response.statusCode !== 200) {
            done.fail('Status code is not 200');
            return;
        }
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.username).toBeDefined();
        expect(body.password).toBeDefined();
        done();
    });
});

test('Update {query_id} credentials, check updates and fields', function(done) {
    expect.assertions(6);
    request({
        method: 'PUT',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/credentials',
        json: true,
        body: {
            username: 'demo-user',
            password: 'demo-user'
        }
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        if (response.statusCode !== 200) {
            done.fail('Status code is not 200');
            return;
        }
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.username).toBeDefined();
        expect(body.username).toEqual('demo-user');
        expect(body.password).toBeDefined();
        expect(body.password).toEqual('demo-user');
        done();
    });
});

test('Reset {query_id} credentials, check fields are back to default', function(done) {
    expect.assertions(6);
    request({
        method: 'DELETE',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/credentials',
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        if (response.statusCode !== 200) {
            done.fail('Status code is not 200');
            return;
        }
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.username).toBeDefined();
        expect(body.username.length).toEqual(0);
        expect(body.password).toBeDefined();
        expect(body.password.length).toEqual(0);
        done();
    });
});

test('Delete stub TS171 {query_id}', function(done) {
    expect.assertions(2);
    request(
        {
            method: 'DELETE',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/' + g_query_id,
            json: true
        }, function (error, response, body) {
            if (error) {
                done.fail(error.toString());
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            done();
        }
    );
});

afterAll(function() {
    g_query_id = null;
    return test_server.stop();
});

