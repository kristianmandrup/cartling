'use strict';

var env = environment();
var config = require('./' + environment());

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

function environment() {
  var env = process.env.NODE_ENV;
  return env ? env.toLowerCase() : 'development';
}
