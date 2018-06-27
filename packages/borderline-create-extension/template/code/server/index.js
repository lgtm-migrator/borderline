function TemplatePlugin() {
    this.getTemplate = TemplatePlugin.prototype.getTemplate.bind(this);
    this.postTemplate = TemplatePlugin.prototype.postTemplate.bind(this);
    this.putTemplate = TemplatePlugin.prototype.putTemplate.bind(this);
    this.deleteTemplate = TemplatePlugin.prototype.deleteTemplate.bind(this);
}

TemplatePlugin.prototype.attach = function(expressAppRouter) {
    expressAppRouter.get('/default', this.getTemplate);
    expressAppRouter.post('/default', this.postTemplate);
    expressAppRouter.put('/default', this.putTemplate);
    expressAppRouter.delete('/default', this.deleteTemplate);
};

TemplatePlugin.prototype.detach = function() {
};

TemplatePlugin.prototype.getTemplate = function(req, res) {
    res.status(200);
    res.json({message: "Template GET"});
};

TemplatePlugin.prototype.postTemplate = function(req, res) {
    res.status(200);
    res.json({message: "Template POST"});
};

TemplatePlugin.prototype.putTemplate = function(req, res) {
    res.status(200);
    res.json({message: "Template PUT"});
};

TemplatePlugin.prototype.deleteTemplate = function(req, res) {
    res.status(200);
    res.json({message: "Template DELETE"});
};

module.exports = TemplatePlugin;
