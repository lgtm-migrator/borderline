const fs = require('fs-extra');

function DummyPlugin(borderline) {
    if (fs.existsSync(__dirname + '/po.jpg') == true)
        console.log('required fs found po.jpg');
    if (borderline.fs.existsSync(__dirname + '/po.jpg') == true)
        console.log('borderline fs found po.jpg');
};

DummyPlugin.prototype.attach = function(borderline, expressAppRouter) {
    expressAppRouter.get('/dummy', this.dummy);
};

DummyPlugin.prototype.detach = function(borderline) {

};

DummyPlugin.prototype.dummy = function(req, res) {
    res.status(200);
    res.send('Dumb dummy');
};

module.exports = DummyPlugin;
