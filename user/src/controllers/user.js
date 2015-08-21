'use strict';

var common = require('phrixus-common')();
var log = common.logger;
var events = common.events;
events.USER = common.events.ROOT + '.user';
var User = require('../models/user');
var _ = require('lodash');

var userController = {
  list: function() {},
  get: function() {},
  create: function() {},
  update: function() {},
  delete: function() {},

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
