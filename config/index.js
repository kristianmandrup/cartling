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
config.registration = registration();
module.exports = config;

function registration() {
  if (module.parent.filename.search('bin/register$') < 0) {
    try {
      return require('./registration.json');
    } catch (error) {
      console.log('Please run bin/register to create the oauth application and registration.json file.');
      throw error;
    }
  }
  return undefined;
}
