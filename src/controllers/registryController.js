const { ErrorHelper } = require('borderline-utils');

/**
 * @fn RegistryController
 * @param registryHelper {RegistryHelper} Global service Registry helper class
 * @constructor
 */
function RegistryController(registryHelper) {
    // Init member vars
    this._registry = registryHelper;

    // Bind member function
    this.getServiceStatus = RegistryController.prototype.getServiceStatus.bind(this);
    this.getServiceDetails = RegistryController.prototype.getServiceDetails.bind(this);
}


RegistryController.prototype.getServiceStatus = function(__unused__req, res) {
    let current_status = this._registry.getStatus();
    if (current_status) {
        res.status(200);
        res.json({ status: current_status });
    }
    else {
        res.status(500);
        res.json(ErrorHelper('Cannot read the service status'));
    }
};


RegistryController.prototype.getServiceDetails = function(__unused__req, res) {
    let current_details = this._registry.getModel();
    if (current_details) {
        res.status(200);
        res.json(current_details);
    }
    else {
        res.status(500);
        res.json(ErrorHelper('Cannot get service details'));
    }
};

module.exports = RegistryController;
