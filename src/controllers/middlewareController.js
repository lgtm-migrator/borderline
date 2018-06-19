
const express = require('express');
const request = require('request');
const { ErrorHelper, Constants } = require('borderline-utils');

/**
 * @fn middlewareConttroller
 * @desc Controller for middleware and step routes
 * @param mongoDBCollection_middleware Collection where the middleware are stored
 * @param mongoDBCollection_step Collection where the steps are stored
 */
function MiddlewareController(registryCollection) {
    this.registryCollection = registryCollection;
}

/**
 * @fn getExtensionStoreRouter
 * @return {Router} Express router where the extension get mounted at
 */
MiddlewareController.prototype.getMiddlewareRouter = function () {

    let _this = this;
    let router = express.Router();

    // Home page route
    router.all('/*', function (req, res) {
        _this.registryCollection.aggregate([{
            $project: {
                ip: true, port: true, type: true, status: true, baseUrl: true, protocol: true,
                delta: { $subtract: [new Date(), '$lastUpdate'] }
            }
        }, {
            $match: {
                type: Constants.BL_MIDDLEWARE_SERVICE,
                delta: { $lt: Constants.BL_DEFAULT_REGISTRY_FREQUENCY * 2 }
            }
        }, {
            $facet: {
                idle: [{ $match: { status: Constants.BL_SERVICE_STATUS_IDLE } }],
                busy: [{ $match: { status: Constants.BL_SERVICE_STATUS_BUSY } }]
            }
        }, {
            $project: {
                middlewares: { $concatArrays: ['$idle', '$busy'] }
            }
        },
        { $unwind: '$middlewares' },
        { $replaceRoot: { newRoot: '$middlewares' } }
        ]).toArray().then(function (result) {
            if (result && result.length > 0) {
                // Todo: iterate through the middleware in case of failure.
                result = result[0];
                req.pipe(request(`${result.protocol}://${result.ip}:${result.port}${req.baseUrl}${req.url}`)).pipe(res);
            }
            else {
                res.status(501);
                res.json(ErrorHelper('No middleware available'));
            }
        }, function (db_error) {
            res.status(404);
            res.json(ErrorHelper('Failed to get middleware data', db_error));
        });
    });

    return router;
};

module.exports = MiddlewareController;
