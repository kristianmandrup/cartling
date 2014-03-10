'use strict';

var helpers = require('../helpers');
var models = require('../models');
var Product = models.Product;
var _ = require('lodash');
var commonController = _.bindAll(new helpers.common.usergrid.Controller(Product));

module.exports = commonController;
