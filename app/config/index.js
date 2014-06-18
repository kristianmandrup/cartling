'use strict';

var Apigee = require('apigee-access');

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
  var env;
  if (Apigee.getMode() === Apigee.APIGEE_MODE) {
    // todo: can't get the environment name because I don't have a request, assuming 'test'
    env = 'apigee-test';
  } else {
    env = process.env.NODE_ENV;
  }
  return env ? env.toLowerCase() : 'development';
}
