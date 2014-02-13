'use strict';

var events = require('./events');
var logger = require('./logger');

var configure = function(config) {
  exports.usergrid = require('./usergrid')(config);
};

var exports = {
  events: events,
  logger: logger
};

module.exports = function(config) {
  if (config) { configure(config); }
  if (!exports.usergrid) { throw new Error('phrixus-common was not configured!'); }
  return exports;
};