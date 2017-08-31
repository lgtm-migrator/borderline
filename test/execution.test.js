const request = require('request');
const TestServer = require('./testserver.js');
let config = require('../config/borderline.config.js');


let test_server = new TestServer();
let g_query_id = '';
const ts171_query = {
    endpoint: { sourceType: "TS171", sourceName: "Transmart instance", sourceHost: "http://glowingbear.thehyve.net/",  sourcePort: 80,  public: false },
    credentials: { username: "fail", password: "nopass" },
    input: {
        local: {
            uri: "/v2/observations?constraint=",
            params: {
                type: "Combination", operator: "and",
                args: [
                    { type: "ConceptConstraint", path: "\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\Male\\" },
                    { type: "ConceptConstraint", path: "\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\Female\\" }
                ]
            },
        },
        std: {}
    },
    status: { status: "unknown", start: null, end: null, info: "" },
    output: {
        local: { dataSize: 0, dataId: null},
        std: { dataSize: 0, dataId: null }
    }
};

beforeAll(function() {
    return new Promise(function (resolve, reject) {
        test_server.start(config).then(function() {
            resolve(true);
        }, function (error) {
            reject(error.toString());
        });
    });
});

test('Create a test TS171 query with invalid credentials, save the id as ref', function(done) {
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
            expect(body.status.status).toEqual('unknown');
            expect(body._id).toBeDefined();
            g_query_id = body._id;
            done();
        }
    );
});

test('Execute a query with invalid_id', function(done) {
    expect.assertions(2);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/execute',
        json: true,
        body: { query: 'invalid_query_id_Not_Object_id_compatible' }
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
        }
        expect(response.statusCode).toEqual(401);
        expect(body).toBeDefined();
        done();
    });
});

test('Execute current query_id, check its started', function(done) {
    expect.assertions(4);
    request({
        method: 'POST',
        baseUrl: 'http://127.0.0.1:' + config.port,
        uri: '/execute',
        json: true,
        body: { query: g_query_id }
    }, function(error, response, body) {
        if (error) {
            done.fail(error.toString());
            return;
        }
        expect(response.statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.status).toEqual('running');
        done();
    });
});

test('Check execution status current query, check auth failed', function(done) {
    expect.assertions(4);
    setTimeout(function() {
        request({
            method: 'GET',
            baseUrl: 'http://127.0.0.1:' + config.port,
            uri: '/execute/' + g_query_id,
            json: true
        }, function (error, response, body) {
            if (error) {
                done.fail(error.toString());
                return;
            }
            expect(response.statusCode).toEqual(200);
            expect(body).toBeDefined();
            expect(body.status).toBeDefined();
            expect(body.status).toEqual('error');
            done();
        });
    }, 3000);
});

test('Delete current TS171 {query_id}', function(done) {
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

afterAll(function() {
    g_query_id = null;
    return test_server.stop();
});

