'use strict';

var exports = {
};

var configure = function(config) {
  exports.usergrid = require('./usergrid')(config);
  exports.logger = require('./logger')(config);
  exports.events = require('./events')(config);
  exports.intents = require('./intents');
};

module.exports = function(config) {
  if (config) { configure(config); }
  if (!exports.usergrid) { throw new Error('phrixus-common was not configured!'); }
  return exports;
};
