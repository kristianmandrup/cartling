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

  list: commonController.list,
  create: commonController.create,
  update: commonController.update,

  get:
    function(req, res) {
      commonController.get(req, res, function (err, reply) {
        onSuccess(err, req, res, reply, function(res, cart) {
          cart.getItems('items', function(err, items) {
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
