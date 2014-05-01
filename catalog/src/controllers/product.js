'use strict';

var helpers = require('../helpers');
var models = require('../models');
var Product = models.Product;
var _ = require('lodash');
var commonController = _.bindAll(new helpers.common.usergrid.Controller(Product));

commonController.oldList = commonController.list;
commonController.list = function(req, res) {
  req.query.limit = 500;
  commonController.oldList(req, res);
};

module.exports = commonController;
