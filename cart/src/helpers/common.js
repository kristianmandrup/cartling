'use strict';

var common = require('phrixus-common')();
common.events.CART = common.events.ROOT + '.cart';
common.events.CART_ITEM = common.events.ROOT + '.cart.item';

module.exports = common;
