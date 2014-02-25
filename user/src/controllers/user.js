'use strict';

var common = require('phrixus-common')();
var log = common.logger;
var events = common.events;
events.USER = common.events.ROOT + '.user';
var User = require('../models/user');
var _ = require('lodash');

var commonController = _.bindAll(new common.usergrid.Controller(User));
var onSuccess = commonController.onSuccess;

var userController = {

  list: commonController.list,
  get: commonController.get,
  create: commonController.create,
  update: commonController.update,
  delete: commonController.delete,

  authenticate:
    function(req, res) {
      if (!req.body) { return res.json(400, 'body required'); }
      var attributes = req.body;
      log.debug('user authenticate %s:', attributes.username);
      User.getAccessToken(attributes.username, attributes.password, function(err, reply) {
        onSuccess(err, req, res, reply, function(res, reply) {
          log.debug('user authenticated %s', attributes.username);
          var event = { op: 'authenticate', attributes: attributes };
          events.publish(events.USER, event);
          res.json(reply);
        });
      });
    }
};
module.exports = userController;
