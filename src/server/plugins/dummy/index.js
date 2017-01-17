function myCustomPluginInitRoutesFunction(router) {
    router.get("/dummy", function(req, res) {
        res.send("Dumb dummy", 200);
    });
}

function myCustomStaticInitRouteFunction(router, staticMiddleWare) {
    router.use("/static", staticMiddleWare("/img"));
}

module.exports = {
    init: myCustomPluginInitRoutesFunction,
    static: myCustomStaticInitRouteFunction
};
