'use strict';

function Controller(UsergridClass) {

  var common = require('../')();
  var log = common.logger;
  var events = common.events;

  var type = UsergridClass._usergrid.type;
  var eventType = events.ROOT + '.' + UsergridClass._usergrid.type;

  // list all
  this.all = function(req, res) {
    log.debug('cart list');
    var self = this;
    UsergridClass.all(function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, reply) {
        res.json(reply);
      });
    });
  };

  // get by req.params.id
  this.get = function(req, res) {
    var id = req.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    log.debug('%s get %s', type, id);
    var self = this;
    UsergridClass.find(id, function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, reply) {
        res.json(reply);
      });
    });
  };

  // create from attributes in req.body
  this.create = function(req, res) {
    log.debug('%s create %s', type, req.body);
    if (!req.body) { return res.json(400, 'body required'); }
    var attributes = req.body;
    var self = this;
    UsergridClass.create(attributes, function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, reply) {
        var event = { op: 'create', attributes: attributes };
        events.publish(eventType, event);
        res.json(reply);
      });
    });
  };

  // update from attributes in req.body
  this.update = function(req, res) {
    var id = req.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    if (!req.body) { return res.json(400, 'body required'); }
    var attributes = req.body;
    log.debug('%s update %s', type, req.body);
    var self = this;
    UsergridClass.find(id, function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, cart) {
        log.debug('cart found %s', id);
        cart.updateAttributes(attributes);
        cart.save(function(err, reply) {
          self.onSuccess(err, req, res, reply, function(res, reply) {
            log.debug('cart updated %s', id);
            var event = { user: '?', op: 'update', attributes: attributes };
            events.publish(eventType, event);
            res.json(reply);
          });
        });
      });
    });
  };

  // delete by req.params.id
  this.delete = function(req, res) {
    var id = req.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    log.debug('%s delete %s', type, id);
    var self = this;
    UsergridClass.find(id, function(err, reply) {
      this.onSuccess(err, req, res, reply, function(res, cart) {
        cart.close(function(err, reply) {
          self.onSuccess(err, req, res, reply, function(res, reply) {
            var event = { op: 'close' };
            events.publish(eventType, event);
            res.json(reply);
          });
        });
      });
    });
  };

  // passes to next when no error
  // if err, translates err into an appropriate json response
  this.onSuccess = function(err, req, res, reply, next) {
    if (err) {
      if (err.isValidationErrors()) {
        log.error(JSON.stringify(err));
        res.json(400, err);
      } else {
        log.error(err.stack);
        res.json(500, err); // todo: more error handling
      }
    } else {
      next(res, reply);
    }
  };

}

module.exports = Controller;
