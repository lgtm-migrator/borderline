function ImportedTester() {
    this.message = 'coucou hibou';
    this.getMessage = this.prototype.getMessage.bind(this);
    this.setMessage = this.prototype.setMessage.bind(this);
}

ImportedTester.prototype.getMessage = function() {
    return this.message;
};

ImportedTester.prototype.setMessage = function(message) {
    this.message = message;
    return this.message;
};
