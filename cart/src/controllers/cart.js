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

  get:
    function(req, res) {
      async.waterfall([
        function(cb) {
          commonController.get(req, res, cb);
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

  close:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      log.debug('cart close %s', id);
      var me = req.token.user;
      var target = req.query.merge;
      async.waterfall([
        function(cb) {
          Cart.find(id, cb);
        },
        function(cart, cb) {
          verify(me, intents.DELETE, cart, { merge: target }, function(err) {
            cb(err, cart);
          });
        },
        function(cart, cb) {
          if (target) {
            cart.copyAndClose(target, cb);
          } else {
            cart.close(cb);
          }
        }
      ],
        function(err, cart) {
          publish(me, events.DELETE, cart);
          if (target) { publish(me, events.UPDATE, target); }
          if (err) { sendError(res, err); }
          res.json(cart);
        });
    }
};
module.exports = cartController;
