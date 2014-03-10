'use strict';

var common;

var exports = {
};

module.exports = function(config) {
  if (config) {
    common = require('phrixus-common')(config);
    exports.routes = require('./routes');
    exports.models = require('./models');
  }
  return exports;
};
