
function DummyPlugin() {
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

import { ImportedTester } from './testimport.js';

