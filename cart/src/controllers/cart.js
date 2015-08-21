'use strict';

var helpers = require('../helpers');
var log = helpers.common.logger;
var events = helpers.common.events;
var models = require('../models');
var Cart = models.Cart;
var _ = require('lodash');
var commonController = _.bindAll(new helpers.common.usergrid.Controller(Cart));
var sendError = commonController.sendError;
var publish = events.publish;
var intents = helpers.common.intents;
var verify = intents.verifyIntent;
var async = require('async');

var cartController = {
  create: commonController.create,
  update: commonController.update,
  list: commonController.list,
  get: require('./cart/get'),
  close: require('./cart/close')
}

module.exports = cartController;
