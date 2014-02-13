'use strict';

var helpers = require('../helpers');
var usergrid = helpers.usergrid;
var validators = usergrid.validators;

// todo: define as a sub-resource of Cart
usergrid.define(this, CartItem);

function CartItem() {
}
