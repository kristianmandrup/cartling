'use strict';

var common = require('../helpers/common');
var usergrid = common.usergrid;
var UserClass = common.usergrid.User;

module.exports = UserClass;

var CartClass = require('./cart');
UserClass.hasMany('carts', CartClass);

function User() {

}
