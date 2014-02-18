'use strict';

var config = require('../../../config');
var libs = require('../../lib')(config);
var User = require('../../lib/usergrid/user');

module.exports = {
  config: config,
  libs: libs,
  User: User
};
