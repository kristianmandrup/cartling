'use strict';

var ROOT = 'phrixus';

// pubsub-js is the baseline for our events API
// todo: configurable
var events = require('pubsub-js');

events.ROOT = ROOT;

// wire up to logger
var logger = require('./logger');
var subscription = events.subscribe(events.ROOT, function(msg, data) {
  logger.log(msg, data);
});

module.exports = events;
