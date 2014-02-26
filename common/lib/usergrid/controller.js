'use strict';

function Controller(UsergridClass) {

  var common = require('../')();
  var log = common.logger;
  var events = common.events;
  var type = UsergridClass._usergrid.type;
  var eventType = events.ROOT + '.' + UsergridClass._usergrid.type;

  // list all
  this.list = function(req, res, cb) {
    log.debug('%s list', type);
    var criteria = req.query.q;
    var self = this;
    UsergridClass.findBy(criteria, function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, reply) {
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
      self.onSuccess(err, req, res, reply, function(res, reply) {
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
    UsergridClass.create(attributes, function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, reply) {
        var event = { op: 'create', attributes: attributes };
        events.publish(eventType, event);
        if (cb && cb.name !== 'callbacks') { return cb(err, reply); }
        res.json(reply);
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
    UsergridClass.update(attributes, function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, reply) {
        log.debug('%s updated %s', type, id);
        var event = { user: '?', op: 'update', attributes: attributes };
        events.publish(eventType, event);
        if (cb && cb.name !== 'callbacks') { return cb(err, reply); }
        res.json(reply);
      });
    });
  };

  // delete by req.params.id
  this.delete = function(req, res, cb) {
    var id = req.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    log.debug('%s delete %s', type, id);
    var self = this;
    UsergridClass.delete(id, function(err, reply) {
      self.onSuccess(err, req, res, reply, function(res, entity) {
        log.debug('%s deleted %s', type, id);
        var event = { op: 'delete' };
        events.publish(eventType, event);
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
