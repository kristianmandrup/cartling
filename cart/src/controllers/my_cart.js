'use strict';

var common = require('../helpers').common;
var log = common.logger;
var events = common.events;
var intents = common.intents;
var models = require('../models');
var Cart = models.Cart;
var _ = require('lodash');
var commonController = _.bindAll(new common.usergrid.Controller(Cart));
var sendError = commonController.sendError;
var UsergridError = common.usergrid.UsergridError;
var publish = events.publish;
var verify = intents.verifyIntent;
var type = Cart._usergrid.type;
var async = require('async');

var OPEN_CRITERIA = { status: 'open' };

var cartController = {

  list:
    function(req, res) {
      log.debug('my cart list');
      var me = req.user;
      me.findCartsBy(OPEN_CRITERIA, function(err, reply) {
        if (err) { sendError(res, err); }
        res.json(reply);
      });
    },

  create:
    function(req, res) {
      async.waterfall([
        function(cb) {
          commonController.create(req, res, cb);
        },
        function(cart, cb) {
          var me = req.user;
          me.addCart(cart, function(err) {
            cb(err, cart)
          });
        },
      ],
        function(err, cart) {
          if (err) { sendError(res, err); }
          res.json(cart);
        });
    },

  update:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      var attributes = req.body;
      log.debug('%s update %j', type, req.body);
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      var me = req.user;
      async.waterfall([
        function(cb) {
          me.findCartsBy(criteria, 1, cb);
        },
        function(carts, cb) {
          if (carts.length === 0) { return cb(make404()); }
          var cart = carts[0];
          log.debug('%s found %s', type, id);
          verify(me, events.UPDATE, cart, attributes, function(err) {
            cb(err, cart);
          });
        },
        function(cart, cb) {
          cart.update(attributes, cb);
        }
      ],
        function(err, cart) {
          if (err) { sendError(res, err); }
          log.debug('%s updated %s', type, id);
          publish(me, events.UPDATE, cart, attributes);
          res.json(cart);
        });
    },

  get:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      var me = req.user;
      async.waterfall([
        function(cb) {
          me.findCartsBy(criteria, 1, cb);
        },
        function(carts, cb) {
          if (carts.length === 0) { return cb(make404()); }
          cb(null, carts[0]);
        }
      ],
        function(err, cart) {
          if (err) { sendError(res, err); }
          log.debug('%s found %s', type, id);
          res.json(cart);
        });
    },

  close:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      log.debug('%s close %s', type, id);
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      var me = req.user;
      async.waterfall([
        function(cb) {
          me.findCartsBy(criteria, 1, cb);
        },
        function(carts, cb) {
          if (carts.length === 0) { return cb(make404()); }
          var cart = carts[0];
          log.debug('%s found %s', type, id);
          verify(me, events.DELETE, cart, null, function(err) {
            cb(err, cart);
          });
        },
        function(cart, cb) {
          cart.close(cb);
        }
      ],
        function(err, cart) {
          if (err) { sendError(res, err); }
          log.debug('%s closed %s', type, id);
          publish(me, events.DELETE, cart);
          res.json(cart);
        });
    }
};
module.exports = cartController;

function make404() {
  var errData = {
    statusCode: 404,
    error: 'service_resource_not_found',
    error_description: 'Service resource not found'
  };
  return new UsergridError(errData);
}
