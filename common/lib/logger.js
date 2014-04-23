'use strict';

// winston is the baseline for our logging API
var logger;
var config = {};

function configure(options) {
  if (config) { config = options; }
  if (config.provider) {
    logger = config.provider;
  }
}

function getLogger() {
  if (!logger) { createLogger(); }
  return logger;
}

function createLogger() {
  var winston = require('winston');
  var transports = [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: true,
      level: config.level
    })
  ];
  if (config.file) {
    transports.push(new (winston.transports.File)({
      filename: config.file.name,
      timestamp: true,
      level: config.file.level ? config.file.level : config.level
    }));
  }
  logger = new (winston.Logger)({ transports: transports });
}

module.exports = function(config) {
  if (config && config.logger) { configure(config.logger); }
  return getLogger();
};
