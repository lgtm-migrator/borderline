const fs = require('fs-extra');
const path = require('path');

var UserDataSource = function() {
    this.dataSources = [];
};

module.exports = UserDataSource;
