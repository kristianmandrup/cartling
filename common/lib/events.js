'use strict';

var ROOT = 'phrixus';
var _ = require('lodash');
var inflection = require('inflection');

var provider;
var logger;
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
  try {
    var type = (_.isString(target)) ? target : target.type;
    var topic = getTopic(type);
    // optimization: would be nice to tell if there are subscribers before I bother to create
    var event = new Event(subject, op, target);
    provider.publish(topic, event);
  }
  catch (err) {
    logger.error('unable to publish event', err);
  }
}

// returns subscription
function subscribe(type, subscriber) {
  return provider.subscribe(getTopic(type), subscriber);
}

function unsubscribe(subscriptionOrListener) {
  provider.unsubscribe(subscriptionOrListener);
}


function configure(config) {

  if (!provider || (config.provider && config.provider !== provider)) {
    if (provider && loggerSubscription) {
      provider.unsubscribe(loggerSubscription);
      loggerSubscription = null;
    }
    provider = config.provider || require('pubsub-js');

    if (config.sendToLogger) {
      logger = require('./logger')();
      loggerSubscription = subscribe(ROOT, function(topic, event) {
        logger.log(config.sendToLogger, 'event(%s): %j', topic, JSON.stringify(event));
      });
    }
  }

  exports.publish = publish;
  exports.subscribe = subscribe;
  exports.unsubscribe = unsubscribe;
}

module.exports = function(config) {
  if (config) { configure(config.events); }
  return exports;
};

function Event(subject, op, target) {
  this.subject = subject;
  this.op = op;             // create | read | update | delete
  this.target = target;
}

function getTopic(type) {
  if (type === ROOT) { return type; }
  return ROOT + '.' + inflection.pluralize(type);
}
