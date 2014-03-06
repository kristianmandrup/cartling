'use strict';

var _ = require('lodash');
var inflection = require('inflection');
var common;
var ActivityLog;
var cartEventRegistration;
var itemEventRegistration;

var exports = {
};

module.exports = function(config) {
  if (config) {
    common = require('phrixus-common')(config);
    exports.routes = require('./routes');

    ActivityLog = require('./models/activity_log');
    if (cartEventRegistration) { common.events.unsubscribe(cartEventRegistration); }
    if (itemEventRegistration) { common.events.unsubscribe(itemEventRegistration); }
    cartEventRegistration = common.events.subscribe('cart', logEventToUsergrid);
    itemEventRegistration = common.events.subscribe('cartitem', logEventToUsergrid);
  }
  return exports;
};

function logEventToUsergrid(topic, event) {
  try {
    var attrs = { op: event.op };
    if (event.subject) { attrs.username = event.subject.username; }
    if (event.target) {
      attrs.collection = inflection.pluralize(event.target.get('type'));
      var target = _.omit(event.target._data, ActivityLog.immutableFields());
      attrs.target = JSON.stringify(target);
    }
    ActivityLog.create(attrs, function (err) {
      if (err) { throw err; }
    });
  }
  catch (err) {
    common.logger.error('unable to log to ActivityLog', err);
  }
}
