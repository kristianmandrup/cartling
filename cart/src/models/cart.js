'use strict';

var common = require('../helpers/common');
var usergrid = common.usergrid;
var validators = usergrid.validators;
var CartItemClass = require('./cart_item');

var CartClass = {};
usergrid.define(CartClass, Cart);
module.exports = CartClass;

CartClass.validates({
  name: [ validators.required ]
});

CartClass.hasMany('items', CartItemClass);

function Cart() {
  this.isClosed = function() {
    return 'closed' === this.get('status');
  };

  this.close = function(cb) {
    this.set('status', 'closed');
    this.save(cb);
  };
}
