'use strict';

var usergrid  = require('../helpers').libs.usergrid;

var BarClass = {};
usergrid.define(BarClass, Bar);
module.exports = BarClass;

function Bar() {
}
