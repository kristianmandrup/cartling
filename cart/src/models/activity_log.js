'use strict';

var common = require('../helpers').common;
var usergrid = common.usergrid;

var ActivityLogClass = {};
usergrid.define(ActivityLogClass, ActivityLog);
module.exports = ActivityLogClass;

function ActivityLog() {
}
