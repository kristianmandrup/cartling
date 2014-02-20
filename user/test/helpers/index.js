'use strict';

var config = require('../../../config');
var common = require('phrixus-common')(config); // phrixus-common must be configured before models are referenced!
var User = require('../../src/models/user');

module.exports = {
  config: config,
  common: common,
  User: User
};
