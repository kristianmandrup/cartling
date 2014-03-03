'use strict';

var helpers = require('../helpers');
var models = require('../models');
var CartItem = models.CartItem;
var _ = require('lodash');
var commonController = _.bindAll(new helpers.common.usergrid.Controller(CartItem));

// just use all default controller methods
module.exports = commonController;
