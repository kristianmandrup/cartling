'use strict';

var ROOT = 'phrixus';
var _ = require('lodash');

var provider;
var loggerSubscription;
var exports = {
  // basic operations
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  AUTHENTICATE: 'authenticate'
};

// publishing is async
function publish(subject, op, target) {
  var type = (_.isString(target)) ? target : target.get('type');
  var topic = getTopic(type);
  // optimization: would be nice to tell if there are subscribers before I bother to create
  var event = new Event(subject, op, target);
  provider.publish(topic, event);
}

// returns subscription
function subscribe(type, subscriber) {
  return provider.subscribe(getTopic(type), subscriber);
}

function unsubscribe(subscriptionOrListener) {
  provider.unsubscribe(subscriptionOrListener);
}


function configure(config) {

  if (!provider || config.provider !== provider) {
    if (provider && loggerSubscription) {
      provider.unsubscribe(loggerSubscription);
      loggerSubscription = null;
    }
    provider = config.provider || require('pubsub-js');
  }

  if (config.sendToLogger) {
    var logger = require('./logger')();
    loggerSubscription = subscribe(ROOT, function(msg, data) {
      logger.log(config.sendToLogger, 'event:', msg, data);
    });
  }

  exports.publish = publish;
  exports.subscribe = subscribe;
  exports.unsubscribe = unsubscribe;
}

module.exports = function(config) {
  if (config) { configure(config); }
  return exports;
};

function Event(subject, op, target) {
  this.subject = subject;
  this.op = op;             // create | read | update | delete
  this.target = target;
}

function getTopic(type) {
  return ROOT + '.' + type;
}
