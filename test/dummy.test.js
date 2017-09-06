const config = require('../config/borderline.config');
let TestServer = require('./testserver.js');

let testserv = new TestServer();

beforeAll(function() {
    return new Promise(function (resolve, reject) {
        testserv.run().then(function() {
            resolve(true);
        }, function(error) {
            reject(error.toString());
        });
    });
});

test('dummy test', function(done) {
   expect.assertions(1);
   expect(true).toBeTruthy();
   done();
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
