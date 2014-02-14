'use strict';

var ROOT = 'phrixus';

// pubsub-js is the baseline for our events API
var events;
var subscription;

function configure(config) {

  if (config.provider) {
    if (events && subscription) {
      events.unsubscribe(subscription);
      subscription = null;
    }
    events = config.provider;
    events.ROOT = ROOT;
  }

  if (config.sendToLogger) {
    var logger = require('./logger')();
    subscription = getEvents().subscribe(ROOT, function(msg, data) {
      logger.log(config.sendToLogger, 'event:', msg, data);
    });
  }
}

function getEvents() {
  if (!events) {
    events = require('pubsub-js');
    events.ROOT = ROOT;
  }
  return events;
}

module.exports = function(config) {
  if (config && config.events) { configure(config.events); }
  return getEvents();
};
