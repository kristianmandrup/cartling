'use strict';

var common = require('../helpers').common;
var usergrid = common.usergrid;
var is = usergrid.validators;

var CartItemClass = {};
usergrid.define(CartItemClass, CartItem);
module.exports = CartItemClass;

CartItemClass.validates({
  sku:      [ is.required ],
  quantity: [ is.required, is.numeric ]
});

CartItemClass.defaults({
  quantity: 1
});

function CartItem() {
}
