'use strict';

var common = require('../helpers').common;
var log = common.logger;
var events = common.events;
var intents = common.intents;
var models = require('../models');
var Cart = models.Cart;
var _ = require('lodash');
var commonController = _.bindAll(new common.usergrid.Controller(Cart));
var onSuccess = commonController.onSuccess;
var UsergridError = common.usergrid.UsergridError;
var publish = events.publish;
var verify = intents.verifyIntent;
var type = Cart._usergrid.type;

var OPEN_CRITERIA = { status: 'open' };

var cartController = {

  list:
    function(req, res) {
      log.debug('my cart list');
      var me = req.token.user;
      me.findCartsBy(OPEN_CRITERIA, function(err, reply) {
        onSuccess(err, req, res, reply, function() {
          res.json(reply);
        });
      });
    },

  create:
    function(req, res) {
      commonController.create(req, res, function (err, cart) {
        onSuccess(err, req, res, cart, function() {
          var me = req.token.user;
          me.addCart(cart, function(err) {
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
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      var me = req.token.user;
      me.findCartsBy(criteria, 1, function(err, reply) {
        first(err, req, res, reply, function(res, cart) {
          log.debug('%s found %s', type, id);
          verify(me, events.UPDATE, cart, attributes, function(err) {
            onSuccess(err, req, res, null, function() {
              cart.update(attributes, function(err, reply) {
                onSuccess(err, req, res, reply, function() {
                  log.debug('%s updated %s', type, id);
                  publish(me, events.UPDATE, 'cart', attributes);
                  res.json(reply);
                });
              });
            });
          });
        });
      });
    },

  get:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      var me = req.token.user;
      me.findCartsBy(criteria, 1, function(err, reply) {
        first(err, req, res, reply, function(res, cart) {
          res.json(cart);
        });
      });
    },

  close:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      log.debug('%s close %s', type, id);
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      var me = req.token.user;
      me.findCartsBy(criteria, 1, function(err, reply) {
        first(err, req, res, reply, function(res, cart) {
          verify(me, events.DELETE, cart, null, function(err) {
            onSuccess(err, req, res, null, function() {
              cart.close(function(err, reply) {
                onSuccess(err, req, res, reply, function() {
                  publish(me, events.DELETE, cart);
                  res.json(reply);
                });
              });
            });
          });
        });
      });
    }
};
module.exports = cartController;

function first(err, req, res, reply, cb) {
  if (!err) {
    if(reply.length === 0) {
      err = make404();
    } else {
      reply = reply[0];
    }
  }
  onSuccess(err, req, res, reply, cb);
}

function make404() {
  var errData = {
    statusCode: 404,
    error: 'service_resource_not_found',
    error_description: 'Service resource not found'
  };
  return new UsergridError(errData);
}
