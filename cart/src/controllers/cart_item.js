'use strict';

var common = require('../helpers/common');
var models = require('../models');
var CartItem = models.CartItem;
var _ = require('lodash');
var commonController = _.bindAll(new common.usergrid.Controller(CartItem));

// just use all default controller methods
module.exports = commonController;
