'use strict';

var common = require('phrixus-common')();
var log = common.logger;
var events = common.events;
events.USER = common.events.ROOT + '.user';
var User = require('../models/user');
var _ = require('lodash');

var commonController = _.bindAll(new common.usergrid.Controller(User));

var userController = {

  list: commonController.list,
  get: commonController.get,
  create: commonController.create,
  update: commonController.update,
  delete: commonController.delete,

  authenticate: function(req, res) {
    if (!req.body) { return res.json(400, 'body required'); }
    var username = req.body.username;
    var password = req.body.password;
    User.getAccessToken(username, password, function(err, reply) {
      commonController.onSuccess(err, req, res, reply, function() {
        res.json(reply);
      });
    });
  }
};
module.exports = userController;
