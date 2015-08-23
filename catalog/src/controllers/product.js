'use strict';

var helpers = require('../helpers');
var models = require('../models');
import models from 'cartling-models';

var Product = models.Product;

module.exports = {
  list: function(req, res) {
    Product.find({id: req.params.id});
  }
};
