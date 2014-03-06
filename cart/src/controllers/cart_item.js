'use strict';

var helpers = require('../helpers');
var models = require('../models');
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

  addItem:
    function(req, res) {
      var cartId = req.params.id;
      if (!req.body) { return res.json(400, 'body required'); }
      var itemAttrs = req.body;
      var item;
      async.waterfall([
        function(cb) {
          findCart(req, cartId, cb);
        },
        function(cart, cb) {
          item = CartItem.new(itemAttrs);
          verify(req.token.user, intents.CREATE, item, { cart: cart }, function(err) {
            cb(err, cart);
          });
        },
        function(cart, cb) {
          cart.addItem(item, cb);
        },
        function(cart, cb) {
          publish(req.token.user, events.CREATE, item);
          cb(null, cart);
        },
        function(cart, cb) {
          cart.fetchItems(cb);
        }
      ],
      function(err, cart) {
        if (err) { sendError(res, err); }
        res.json(cart);
      });
    },

  removeItem:
    function(req, res) {
      var cartId = req.params.id;
      var itemId = req.params.itemId;
      if (!cartId) { return res.json(400, 'missing id'); }
      if (!itemId) { return res.json(400, 'missing item id'); }
      var item;
      async.waterfall([
        function(cb) {
          findCart(req, cartId, cb);
        },
        function(cart, cb) {
          cart.findItem(itemId, function(err, reply) {
            item = reply;
            cb(err, cart);
          });
        },
        function(cart, cb) {
          verify(req.token.user, intents.DELETE, item, { cart: cart }, function(err) {
            cb(err, cart);
          });
        },
        function(cart, cb) {
          cart.deleteItem(itemId, cb);
        },
        function(cart, cb) {
          publish(req.token.user, events.DELETE, item);
          cb(null, cart);
        },
        function(cart, cb) {
          cart.fetchItems(cb);
        }
      ],
        function(err, cart) {
          if (err) { sendError(res, err); }
          res.json(cart);
        });
    },

  updateItem:
    function(req, res) {
      var cartId = req.params.id;
      var itemId = req.params.itemId;
      var itemAttrs = req.body;
      if (!cartId) { return res.json(400, 'missing id'); }
      if (!itemId) { return res.json(400, 'missing item id'); }
      if (!itemAttrs) { return res.json(400, 'body required'); }
      var item;
      async.waterfall([
        function(cb) {
          findCart(req, cartId, cb);
        },
        function(cart, cb) {
          cart.findItem(itemId, function(err, reply) {
            item = reply;
            cb(err, cart);
          });
        },
        function(cart, cb) {
          verify(req.token.user, intents.UPDATE, item, itemAttrs, function(err) {
            cb(err, cart);
          });
        },
        function(cart, cb) {
          item.update(itemAttrs, function(err, reply) {
            cb(err, cart);
          });
        },
        function(cart, cb) {
          publish(req.token.user, events.UPDATE, item);
          cb(null, cart);
        },
        function(cart, cb) {
          cart.fetchItems(cb);
        }
      ],
        function(err, cart) {
          if (err) { sendError(res, err); }
          res.json(cart);
        });
    }
};
module.exports = controller;

// scopes to logged in user as appropriate - based on url
function findCart(req, cartId, cb) {
  if (req.url.indexOf('/my/') > 0) {
    var me = req.token.user;
    me.findCart(cartId, cb);
  } else {
    Cart.find(cartId, cb);
  }
}
