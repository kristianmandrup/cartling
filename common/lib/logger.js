'use strict';

// winston is the baseline for our events API
var logger = require('winston');

function configure(config) {
  if (config.provider) {
    logger = config.provider;
  }
}

module.exports = function(config) {
  if (config && config.logger) { configure(config.logger); }
  return logger;
};
