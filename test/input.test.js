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

test('Get query input for invalid query_id', function (done) {
    expect.assertions(3);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/invalid_query_id/input',
        json: true
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(body).toBeDefined();
        done();
    });
});

test('Get {query_id} input, check its empty', function (done) {
    expect.assertions(3);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/input',
        json: true
    }, function (error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(401);
        expect(body).toBeDefined();
        done();
    });
});

test('Write query input for {query_id} with dummy TS171 query', function (done) {
    expect.assertions(5);
    request({
        method: 'PUT',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/input',
        json: true,
        body: {
            uri: '/v2/observations?constraint=',
            params: {
                type: 'Combination',
                operator: 'and',
                args: [
                    {
                        type: 'ConceptConstraint',
                        path: '\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\Male\\'
                    },
                    {
                        type: 'ConceptConstraint',
                        path: '\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\Female\\'
                    }]
            }
        }
    }, function (error, response, body) {
        if (error)
            done.fail(error.toString());
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.metadata).toBeDefined();
        expect(body.metadata.uri).toBeDefined();
        done();
    });
});


test('Get query input for {query_id}, check previously set fields are present', function (done) {
    expect.assertions(5);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id + '/input',
        json: true
    }, function (error, response, body) {
        if (error)
            done.fail(error);
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.uri).toBeDefined();
        expect(body.params).toBeDefined();
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

