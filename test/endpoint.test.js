const request = require('request');
const TestServer = require('./testServer.js');
let config = require('../config/borderline.test.config.js');

let g_query_id = '';
let test_server = new TestServer();
beforeAll(function() {
    return new Promise(function (resolve, reject) {
        test_server.start().then(function() {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});

test('Create stub TS171 query', function(done) {
    expect.assertion(5);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/new/TS171',
        json: true,
        body: {}
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.status.status).toEqual('unknown');
        expect(body._id).toBeDefined();
        g_query_id = body._id;
    });
});

test('Get {query_id} endpoint, check type is TS171', function(done) {
    expect.assertions(3);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/endpoint',
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        done.fail(g_query_id);
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.sourceType).toEqual('TS171');
        done();
    });
});

afterAll(function() {
    return test_server.stop();
});
