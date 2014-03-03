'use strict';

function Controller(UsergridClass) {

  var common = require('../')();
  var log = common.logger;
  var events = common.events;
  var intents = common.intents;
  var type = UsergridClass._usergrid.type;
  var publish = events.publish;
  var verify = intents.verifyIntent;

  // list all
  this.list = function(req, res, cb) {
    log.debug('%s list', type);
    var criteria = req.query.q;
    var self = this;
    UsergridClass.findBy(criteria, function(err, reply) {
      self.onSuccess(err, req, res, reply, function() {
        if (cb && cb.name !== 'callbacks') { return cb(err, reply); }
        res.json(reply);
      });
    });
  };

  // get by req.params.id
  this.get = function(req, res, cb) {
    var id = req.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    log.debug('%s get %s', type, id);
    var self = this;
    UsergridClass.find(id, function(err, reply) {
      self.onSuccess(err, req, res, reply, function() {
        if (cb && cb.name !== 'callbacks') { return cb(err, reply); }
        res.json(reply);
      });
    });
  };

  // create from attributes in req.body
  this.create = function(req, res, cb) {
    log.debug('%s create %s', type, req.body);
    if (!req.body) { return res.json(400, 'body required'); }
    var attributes = req.body;
    var self = this;
    var me = req.token.user;
    verify(me, intents.CREATE, type, attributes, function(err) {
      self.onSuccess(err, req, res, null, function() {
        UsergridClass.create(attributes, function(err, reply) {
          self.onSuccess(err, req, res, reply, function() {
            log.debug('%s created %s', type, reply.get('uuid'));
            publish(me, intents.CREATE, type, attributes);
            if (cb && cb.name !== 'callbacks') { return cb(err, reply); }
            res.json(reply);
          });
        });
      });
    });
  };

  // update from attributes in req.body
  this.update = function(req, res, cb) {
    var id = req.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    if (!req.body) { return res.json(400, 'body required'); }
    var attributes = req.body;
    attributes.uuid = id;
    log.debug('%s update %s', type, req.body);
    var self = this;
    var me = req.token.user;
    verify(me, intents.UPDATE, type, attributes, function(err) {
      self.onSuccess(err, req, res, null, function() {
        UsergridClass.update(attributes, function(err, reply) {
          self.onSuccess(err, req, res, reply, function() {
            log.debug('%s updated %s', type, id);
            publish(me, events.UPDATE, type, attributes);
            if (cb && cb.name !== 'callbacks') { return cb(err, reply); }
            res.json(reply);
          });
        });
      });
    });
  };

  // delete by req.params.id
  this.delete = function(req, res, cb) {
    var id = req.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    log.debug('%s delete %s', type, id);
    var self = this;
    var me = req.token.user;
    UsergridClass.delete(id, function(err, reply) {
      self.onSuccess(err, req, res, reply, function() {
        log.debug('%s deleted %s', type, id);
        publish(me, events.DELETE, entity);
        if (cb && cb.name !== 'callbacks') { return cb(err, reply); }
        res.json(reply);
      });
    });
  };

  // passes to next when no error
  // if err, translates err into an appropriate json response
  this.onSuccess = function(err, req, res, reply, next) {
    if (err) {
      if (err.isValidationErrors) {
        log.error(JSON.stringify(err));
        res.json(400, err);
      } else if (err.statusCode) {
        log.error(err.message);
        res.json(err.statusCode, err);
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
