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
  updateItem:
};
module.exports = controller;

// scopes to logged in user as appropriate - based on url
function findCart(req, cartId, cb) {
  if (req.url.indexOf('/my/') > 0) {
    var me = req.user;
    me.findCart(cartId, cb);
  } else {
    Cart.find(cartId, cb);
  }
}
