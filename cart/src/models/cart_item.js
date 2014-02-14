'use strict';

var common = require('../helpers/common');
var usergrid = common.usergrid;
var validators = usergrid.validators;

// todo: define this as a sub-resource of Cart?
usergrid.define(this, CartItem);

function CartItem() {
  this.validates({
    sku:      [ validators.required ],
    quantity: [ validators.required, validators.number ]
  });
}
