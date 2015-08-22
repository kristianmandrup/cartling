'use strict';

var common = require('phrixus-common')();
var log = common.logger;
var events = common.events;
events.USER = common.events.ROOT + '.user';
var _ = require('lodash');

var models = require('cartling-models');
var User = models.User;

var userController = {
  list: function*() {
    // return all users from User model
    yield User.find();
  },
  get: function*(id) {
    // return user by id
    yield User.find({id: id});
  },
  create: function*(args) {
    yield User.create(args);
  },
  update: function*(args) {
    yield User.update(args);
  },
  delete: function*(id) {
    yield User.find().delete();
  },

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
