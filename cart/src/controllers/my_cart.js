'use strict';

var common = require('../helpers/common');
var log = common.logger;
var events = common.events;
var models = require('../models');
var Cart = models.Cart;
var _ = require('lodash');
var commonController = _.bindAll(new common.usergrid.Controller(Cart));
var onSuccess = commonController.onSuccess;

var cartController = {

  list:
    function(req, res) {
      log.debug('my cart list');
      me(req).getCarts(function(err, reply) {
        onSuccess(err, req, res, reply, function(res, reply) {
          res.json(reply);
        });
      });
    },

  create:
    function(req, res) {
      commonController.create(req, res, function (err, reply) {
        onSuccess(err, req, res, reply, function(res, cart) {
          me(req).addCart(cart, function(err) {
            res.json(cart);
          });
        });
      });
    },

  update:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      var attributes = req.body;
      log.debug('%s update %s', 'my cart', req.body);
      me(req).getCart(id, function(err, reply) {
        onSuccess(err, req, res, reply, function(res, cart) {
          log.debug('cart found %s', id);
          cart.update(attributes, function(err, reply) {
            onSuccess(err, req, res, reply, function(res, reply) {
              log.debug('cart updated %s', id);
              var event = { op: 'update', attributes: attributes };
              events.publish(events.CART, event);
              res.json(reply);
            });
          });
        });
      });
    },

  get:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      me(req).getCart(id, function(err, reply) {
        onSuccess(err, req, res, reply, function(res, cart) {
          res.json(cart);
        });
      });
    },

  close:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      log.debug('cart close %s', id);
      Cart.find(id, function(err, reply) {
        onSuccess(err, req, res, reply, function(res, cart) {
          cart.close(function(err, reply) {
            onSuccess(err, req, res, reply, function(res, reply) {
              var event = { op: 'close' };
              events.publish(events.CART, event);
              res.json(reply);
            });
          });
        });
      });
    }
};
module.exports = cartController;

function me(req) {
  return req.token.user;
}
