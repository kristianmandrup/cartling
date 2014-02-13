'use strict';

var config;
if (process.env.NODE_ENV) {
  try {
    config = require('./' + process.env.NODE_ENV.toLowerCase());
  } catch (err) {
    // ignore
  }
}
if (!config) {
  config = require('./development');
}
module.exports = config;
