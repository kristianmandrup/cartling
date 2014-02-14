'use strict';

var common = require('../helpers/common');
var log = common.logger;
var events = common.events;
var models = require('../models');
var Cart = models.Cart;
var onSuccess = require('../helpers/controllers').onSuccess;

// todo: user context
// todo: user security
var cartController = {
  list:
    function(req, res) {
      log.debug('cart list');
      Cart.all(function(err, reply) {
        onSuccess(err, req, res, reply, function(res, reply) {
          res.json(reply);
        });
      });
    },

  get:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      log.debug('cart get %s', id);
      Cart.find(id, function(err, reply) {
        onSuccess(err, req, res, reply, function(res, reply) {
          res.json(reply);
        });
      });
    },

  create:
    function(req, res) {
      log.debug('cart create %s', req.body);
      if (!req.body) { return res.json(400, 'body required'); }
      var attributes = req.body;
      Cart.create(attributes, function(err, reply) {
        onSuccess(err, req, res, reply, function(res, reply) {
          var event = { user: '?', op: 'create', attributes: attributes };
          events.publish(events.CART, event);
          res.json(reply);
        });
      });
    },

  update:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      if (!req.body) { return res.json(400, 'body required'); }
      var attributes = req.body;
      log.debug('cart update %s', id);
      Cart.find(id, function(err, reply) {
        onSuccess(err, req, res, reply, function(res, cart) {
          log.debug('cart found %s', id);
          cart.updateAttributes(attributes);
          cart.save(function(err, reply) {
            onSuccess(err, req, res, reply, function(res, reply) {
              log.debug('cart updated %s', id);
              var event = { user: '?', op: 'update', attributes: attributes };
              events.publish(events.CART, event);
              res.json(reply);
            });
          });
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
              var event = { user: '?', op: 'close' };
              events.publish(events.CART, event);
              res.json(reply);
            });
          });
        });
      });
    }
};
module.exports = cartController;
