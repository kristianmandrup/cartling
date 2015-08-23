'use strict';

var helpers = require('../helpers');
var models = require('cartling-models');
var Cart = models.Cart;
var CartItem = models.CartItem;
var _ = require('lodash');
var commonController = _.bindAll(new helpers.common.usergrid.Controller(CartItem));
var sendError = commonController.sendError;
var async = require('async');
var intents = helpers.common.intents;
var verify = intents.verifyIntent;
var events = helpers.common.events;
var publish = events.publish;

var controller = {
  addItem: require('./cart-item/add-item'),
  removeItem: require('./cart-item/remove-item'),
  updateItem: require('./cart-item/update-item')
};

module.exports = controller;
