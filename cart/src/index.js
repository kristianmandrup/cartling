'use strict';

var _ = require('lodash');
var inflection = require('inflection');
var common;
var ActivityLog;
var cartEventRegistration;
var itemEventRegistration;

export default function(config) {
  if (config) {
    common = require('cartling-common')(config);
    var models = require('cartling-models');
    ActivityLog = models.ActivityLog;
    if (cartEventRegistration) { common.events.unsubscribe(cartEventRegistration); }
    if (itemEventRegistration) { common.events.unsubscribe(itemEventRegistration); }
    cartEventRegistration = common.events.subscribe('cart', logEvent);
    itemEventRegistration = common.events.subscribe('cartitem', logEvent);
  }

  return {
    routes: require('./routes')
  }
};

function logEvent(topic, event) {
  try {
    var attrs = { op: event.op };
    if (event.subject) { attrs.username = event.subject.username; }
    if (event.target) {
      attrs.collection = inflection.pluralize(event.target.type);
      var target = event.target;
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
