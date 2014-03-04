'use strict';

var common = require('../helpers').common;
var usergrid = common.usergrid;

var CartActivityLogClass = {};
usergrid.define(CartActivityLogClass, CartActivityLog);
module.exports = CartActivityLogClass;

function CartActivityLog() {
}
