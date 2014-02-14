'use strict';

// winston is the baseline for our logging API
var logger;
var file = 'phrixus.log';

function configure(config) {
  if (config.provider) {
    logger = config.provider;
  }
  if (config.file) {
    file = config.file;
  }
}

function getLogger() {
  if (!logger) { createLogger(); }
  return logger;
}

function createLogger() {
  var winston = require('winston');
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        colorize: true,
        timestamp: true,
        level: 'debug'
      }),
      new (winston.transports.File)({
        filename: file,
        timestamp: true,
        level: 'info'
      })
    ]
  });
}

module.exports = function(config) {
  if (config && config.logger) { configure(config.logger); }
  return getLogger();
};
