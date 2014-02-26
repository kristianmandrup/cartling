'use strict';

var common = require('../helpers/common');
var log = common.logger;
var events = common.events;
var models = require('../models');
var Cart = models.Cart;
var _ = require('lodash');
var commonController = _.bindAll(new common.usergrid.Controller(Cart));
var onSuccess = commonController.onSuccess;
var UsergridError = common.usergrid.UsergridError;

var OPEN_CRITERIA = { status: 'open' };

var cartController = {

  list:
    function(req, res) {
      log.debug('my cart list');
      me(req).findCartsBy(OPEN_CRITERIA, function(err, reply) {
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
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      me(req).findCartsBy(criteria, 1, function(err, reply) {
        first(err, req, res, reply, function(res, cart) {
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
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      me(req).findCartsBy(criteria, 1, function(err, reply) {
        first(err, req, res, reply, function(res, cart) {
          res.json(cart);
        });
      });
    },

  close:
    function(req, res) {
      var id = req.params.id;
      if (!id) { return res.json(400, 'missing id'); }
      log.debug('cart close %s', id);
      var criteria = { _id: id };
      _.assign(criteria, OPEN_CRITERIA);
      me(req).findCartsBy(criteria, 1, function(err, reply) {
        first(err, req, res, reply, function(res, cart) {
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
    name: 'service_resource_not_found',
    message: 'Service resource not found'
  };
  return new UsergridError(errData);
}
