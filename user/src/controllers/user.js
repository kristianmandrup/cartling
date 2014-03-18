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
  delete: commonController.delete
};
module.exports = userController;
