const request = require('request');
const TestServer = require('./testserver.js');
let config = require('../config/borderline.config.js');
const { Constants } = require('borderline-utils');

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

test('Create new empty query, save the id as ref', function(done) {
    expect.assertions(5);
    request(
        {
            method: 'GET',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/query/new',
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
            expect(body._id).toBeDefined();
            g_query_id = body._id;
            done();
        }
    );
});

test('Get empty query from {query_id}', function(done) {
    expect.assertions(4);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id,
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body._id).toBeDefined();
        expect(body._id).toEqual(g_query_id);
        done();
    });
});

test('Delete query with invalid ID', function(done) {
    expect.assertions(3);
    request({
        method: 'DELETE',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/invalid_id',
        json: true
    }, function(error, response, body) {
        if (error)
            done.fail(error.toString());
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(500);
        expect(body).toBeDefined();
        done();
    });
});

test('Delete query from {query_id}, reset query_id ref', function(done) {
    expect.assertions(2);
    request({
        method: 'DELETE',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id,
        json: true
    }, function(error, response, body) {
        if (error)
            done.fail(error.toString());
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        g_query_id = null;
        done();
    });
});

test('Create TS171 query, save the id as ref', function(done) {
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

test('Get TS171 query from {query_id}, check _id and sourceType', function(done) {
    expect.assertions(6);
    request({
        method: 'GET',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id,
        json: true
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        expect(body._id).toBeDefined();
        expect(body._id).toEqual(g_query_id);
        expect(body.endpoint).toBeDefined();
        expect(body.endpoint.sourceType).toEqual(Constants.BL_QUERY_TYPE_TS171);
        done();
    });
});

test('Delete TS171 query from {query_id}', function(done) {
    expect.assertions(2);
    request({
        method: 'DELETE',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/query/' + g_query_id,
        json: true
    }, function(error, response, body) {
        if (error)
            done.fail(error.toString());
        expect(response).toBeDefined();
        expect(response.statusCode).toEqual(200);
        g_query_id = null;
        done();
    });
});

afterAll(function() {
    g_query_id = null;
    return test_server.stop();
});

