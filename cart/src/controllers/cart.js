'use strict';

var helpers = require('../helpers');
var log = helpers.common.logger;
var events = helpers.common.events;
var models = require('../models');
var Cart = models.Cart;
var _ = require('lodash');
var commonController = _.bindAll(new helpers.common.usergrid.Controller(Cart));
var onSuccess = commonController.onSuccess;
var publish = events.publish;

var cartController = {

  create: commonController.create,
  update: commonController.update,
  list: commonController.list,

  get:
    function(req, res) {
      commonController.get(req, res, function (err, cart) {
        onSuccess(err, req, res, cart, function() {
          cart.getItems(function(err, items) {
            cart.set('items', items);
            res.json(cart);
          });
        });
      });
    },

  close:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      log.debug('cart close %s', id);
      var me = req.token.user;
      Cart.find(id, function(err, cart) {
        onSuccess(err, req, res, cart, function() {
          var target = req.query.merge;
          if (target) {
            cart.copyAndClose(target, function(err) {
              onSuccess(err, req, res, null, function(res, reply) {
                publish(me, events.DELETE, cart);
                publish(me, events.UPDATE, target, reply);
                res.json(reply);
              });
            });
          } else {
            cart.close(function(err, reply) {
              onSuccess(err, req, res, reply, function() {
                var event = { op: 'close' };
                publish(me, events.DELETE, cart);
                res.json(reply);
              });
            });
          }
        });
      });
    }
};
module.exports = cartController;
