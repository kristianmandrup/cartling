'use strict';

var exports = {
};

module.exports = function(config) {
  if (config) {
    require('phrixus-common')(config);
    exports.routes = require('./routes');

    exports.User = require('./models/user');
  }
  return exports;
};
