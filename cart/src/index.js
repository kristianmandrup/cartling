'use strict';

var _ = require('lodash');
var common;
var CartActivityLog;
var eventRegistration;

var exports = {
};

module.exports = function(config) {
  if (config) {
    common = require('phrixus-common')(config);
    exports.routes = require('./routes');

    CartActivityLog = require('./models/cart_activity_log');
    if (eventRegistration) {
      common.events.unsubscribe(eventRegistration);
    }
    eventRegistration = common.events.subscribe('cart', logEventToUsergrid);
  }
  return exports;
};

function logEventToUsergrid(topic, event) {
  try {
    var attrs = { op: event.op };
    if (event.subject) { attrs.username = event.subject.username; }
    if (event.target) {
      var target = _.omit(event.target._data, CartActivityLog.immutableFields());
      attrs.target = JSON.stringify(target);
    }
    CartActivityLog.create(attrs, function (err) {
      if (err) { throw err; }
    });
  }
  catch (err) {
    common.logger.error('unable to log to CartActivityLog', err);
  }
}
