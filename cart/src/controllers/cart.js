'use strict';

var helpers = require('../helpers');
var log = helpers.common.logger;
var events = helpers.common.events;
var models = require('cartling-models');
var Cart = models.Cart;

var _ = require('lodash');
var commonController = _.bindAll(new helpers.common.usergrid.Controller(Cart));
var sendError = commonController.sendError;
var publish = events.publish;
var intents = helpers.common.intents;
var verify = intents.verifyIntent;
var async = require('async');

var cartController = {
  create: function*(args) {
    yield Cart.create(args);
  },
  update: function*(args) {
    yield Cart.update(args);
  },
  list: function*() {
    yield Cart.find();
  },
  get: require('./cart/get'),
  close: require('./cart/close')
}

module.exports = cartController;
