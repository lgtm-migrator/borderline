function myCustomPluginInitRoutesFunction(router) {
    router.get('/dummy', function (req, res) {
        res.status(200).send('Dumb dummy');
    });
}

function myCustomStaticInitRouteFunction(router, staticMiddleWare) {
    router.use('/static', staticMiddleWare('/img'));
}

module.exports = {
    init: myCustomPluginInitRoutesFunction,
    static: myCustomStaticInitRouteFunction,
};
