'use strict';

var config = require('../../../config');
var libs = require('../../lib')(config);

module.exports = {
  config: config,
  libs: libs
};
