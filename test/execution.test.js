const request = require('request');
const TestServer = require('./testserver.js');
let config = require('../config/borderline.config.js');
const { Constants } = require('borderline-utils');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000; // 12 seconds

let test_server = new TestServer();
let g_query_id = '';
const ts171_query = {
    endpoint: { type: 'TS171', name: 'Transmart instance', host: 'tm171-release-pg.thehyve.net', port: 80, protocol: 'http', baseUrl: '', public: false },
    credentials: { username: 'admin', password: 'admin' },
    input: [{
        metadata: {
            uri: '/v2/observations?constraint=',
            params: {
                type: 'combination', operator: 'and',
                args: [
                    { type: 'concept', path: '\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\Male\\' },
                    { type: 'concept', path: '\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\Female\\' }
                ],
            },
            type: 'clinical'
        },
        cache: {}
    }
    ],
    status: { status: Constants.BL_QUERY_STATUS_UNKNOWN, start: null, end: null, info: '' },
    output: [{
        metadata: {},
        cache: {}
    }]
};

beforeAll(function () {
    return new Promise(function (resolve, reject) {
        test_server.start(config).then(function () {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});

test('Execute a query with invalid_id', function (done) {
    expect.assertions(2);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/invalid_query_id_Not_Object_id_compatible/execute',
        json: true,
        body: { nocache: true }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response.statusCode).toEqual(401);
        expect(body).toBeDefined();
        done();
    });
});

test('Create a test TS171 query with invalid credentials, save the id as ref', function (done) {
    expect.assertions(6);
    let query_data = Object.assign({}, ts171_query, {
        credentials: {
            username: 'invalid',
            password: 'invalid'
        }
    });
    request(
        {
            method: 'POST',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/new/',
            json: true,
            body: query_data
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

test('Execute current query_id, check its started', function (done) {
    expect.assertions(3);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/execute',
        json: true,
        body: { nocache: false }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body).toBeTruthy();
        done();
    });
});

test('Wait 5 secs, Check execution status current query, check auth failed', function (done) {
    expect.assertions(4);
    setTimeout(function () {
        request({
            method: 'GET',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/' + g_query_id + '/status',
            json: true
        }, function (error, response, body) {
            if (error) {
                done.fail(error.toString());
                return;
            }
            expect(response.statusCode).toEqual(200);
            expect(body).toBeDefined();
            expect(body.status).toBeDefined();
            expect(body.status).toEqual(Constants.BL_QUERY_STATUS_ERROR);
            done();
        });
    }, 5000);
});

test('Delete current TS171 {query_id}', function (done) {
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
            }
            expect(response).toBeDefined();
            expect(response.statusCode).toEqual(200);
            done();
        }
    );
});

test('Create a VALID test TS171 query, save the id as ref', function (done) {
    expect.assertions(6);
    request(
        {
            method: 'POST',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/new/',
            json: true,
            body: ts171_query
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

test('Execute current query_id, check its started', function (done) {
    expect.assertions(3);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/execute',
        json: true,
        body: { query: g_query_id }
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body).toBeTruthy();
        done();
    });
});


test('Wait 10 secs, Check execution status current query is done', function (done) {
    expect.assertions(4);
    setTimeout(function () {
        request({
            method: 'GET',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/' + g_query_id + '/status',
            json: true
        }, function (error, response, body) {
            if (error) {
                done.fail(error.toString());
                return;
            }
            expect(response.statusCode).toEqual(200);
            expect(body).toBeDefined();
            expect(body.status).toBeDefined();
            expect(body.status).toEqual(Constants.BL_QUERY_STATUS_DONE);
            done();
        });
    }, 10000);
});


test('Delete current TS171 {query_id}', function (done) {
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

