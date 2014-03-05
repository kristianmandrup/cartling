'use strict';

var _ = require('lodash');
var common;
var ActivityLog;
var eventRegistration;

var exports = {
};

module.exports = function(config) {
  if (config) {
    common = require('phrixus-common')(config);
    exports.routes = require('./routes');

    ActivityLog = require('./models/activity_log');
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
      attrs.collection = event.target.get('type');
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
