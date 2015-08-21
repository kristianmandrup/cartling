'use strict';

var common = require('../helpers').common;
var log = common.logger;
var events = common.events;
var intents = common.intents;
var models = require('../models');
var Cart = models.Cart;
var _ = require('lodash');
var publish = events.publish;
var verify = intents.verifyIntent;
var type = Cart._usergrid.type;
var async = require('async');

var OPEN_CRITERIA = { status: 'open' };

module.exports = require('./my-cart');

function make404() {
  var errData = {
    statusCode: 404,
    error: 'service_resource_not_found',
    error_description: 'Service resource not found'
  };
  return new Error(errData);
}
