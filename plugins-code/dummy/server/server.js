function DummyPlugin() {
    this.dummy = this.prototype.dummy.bind(this);
};

DummyPlugin.prototype.attach = function(expressAppRouter) {
    expressAppRouter.get('/v2/dummy', this.dummy);
};

DummyPlugin.prototype.detach = function() {

};

DummyPlugin.prototype.dummy = function(req, res) {
    res.status(200);
    res.send('Dumb dummy v2');
};

module.exports = DummyPlugin;
