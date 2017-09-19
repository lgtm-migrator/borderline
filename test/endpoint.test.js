const request = require('request');
const TestServer = require('./testserver.js');
let config = require('../config/borderline.config.js');
const { Constants } = require('borderline-utils');

let test_server = new TestServer();
let g_query_id = '';

beforeAll(function () {
    return new Promise(function (resolve, reject) {
        test_server.start(config).then(function () {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});

test('Create stub TS171 query, save the id as ref', function (done) {
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
            expect(body.status.status).toEqual(Constants.BL_QUERY_STATUS_UNKNOWN);
            expect(body._id).toBeDefined();
            g_query_id = body._id;
            done();
        }
    );
});

test('Get {query_id} endpoint, check type is TS171', function (done) {
    expect.assertions(3);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/endpoint',
        json: true
    }, function (error, response, body) {
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
        expect(body.type).toEqual('TS171');
        done();
    });
});

test('Set {query_id} endpoint port to 80, check update happened', function (done) {
    expect.assertions(3);
    request({
        method: 'PUT',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/endpoint',
        json: true,
        body: {
            type: 'TS171',
            name: 'Transmart 17.1',
            host: 'glowingbear.thehyve.net',
            port: 80,
            protocol: 'http',
            baseUrl: '',
            public: false
        }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body.port).toEqual(80);
        done();
    });
});

test('Reset endpoint for {query_id}, check port is back to default at 8080', function (done) {
    expect.assertions(3);
    request({
        method: 'DELETE',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/endpoint',
        json: true
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body.port).toEqual(8080);
        done();
    });
});

test('Delete stub TS171 {query_id}', function (done) {
    expect.assertions(2);
    request(
        {
            method: 'DELETE',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/' + g_query_id,
            json: true
        }, function (error, response, __unused__body) {
            if (error) {
                done.fail(error.toString());
                return;
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            done();
        }
    );
});

afterAll(function () {
    g_query_id = null;
    return test_server.stop();
});

