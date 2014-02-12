'use strict';

var config;
if (process.env.NODE_ENV) {
  try {
    config = require('./' + process.env.NODE_ENV.toLowerCase());
  } catch (err) {

  }
}
if (!config) {
  config = require('./development');
}
module.exports = config;
