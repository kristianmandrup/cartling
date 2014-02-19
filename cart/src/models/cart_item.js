'use strict';

var common = require('../helpers/common');
var usergrid = common.usergrid;
var validators = usergrid.validators;
var Cart = require('./cart');

var CartItemClass = {};
usergrid.define(CartItemClass, CartItem);
module.exports = CartItemClass;

CartItemClass.validates({
  sku:      [ validators.required ],
  quantity: [ validators.required, validators.numeric ]
});

CartItemClass.defaults({
  quantity: 1
});

// todo: CartItemClass.belongsTo(Cart)
//CartItemClass.belongsTo(Cart, 'item');

function CartItem() {
}
