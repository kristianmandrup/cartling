'use strict';

var config = require('../../../app/config');
var libs = require('../../lib')(config);
var User = require('../../lib/usergrid/user');
var intents = require('../../lib/intents');

module.exports = {
  config: config,
  libs: libs,
  User: User,
  intents: intents
};
