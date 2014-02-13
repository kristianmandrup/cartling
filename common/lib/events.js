'use strict';

var ROOT = 'phrixus';

// pubsub-js is the baseline for our events API
var events = require('pubsub-js');
events.ROOT = ROOT;
var subscription;

function configure(config) {

  if (config.provider) {
    events = config.provider;
    events.ROOT = ROOT;
  }

  if (config.sendToLogger) {
    var logger = require('./logger')();
    if (subscription) { events.unsubscribe(subscription); }
    subscription = events.subscribe(events.ROOT, function(msg, data) {
      logger.log(msg, data);
    });
  }
}

module.exports = function(config) {
  if (config && config.events) { configure(config.events); }
  return events;
};
