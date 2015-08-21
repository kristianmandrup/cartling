'use strict';

var helpers = require('../helpers');
var models = require('../models');
var Product = models.Product;

module.exports = function(req, res) {
  req.query.limit = 500;
};
