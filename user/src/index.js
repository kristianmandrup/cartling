'use strict';

var _ = require('lodash');
var common;
var log;

var exports = {
};

module.exports = function(config) {
  if (config) {
    common = require('phrixus-common')(config);
    log = common.logger;

    exports.routes = require('./routes');
    exports.User = require('./models/user');

    exports.startGuestUserReaper = startGuestUserReaper;
    exports.stopGuestUserReaper = stopGuestUserReaper;

    startReaperIfValid(config);
  }
  return exports;
};


var reaperTimer;

function startGuestUserReaper(timeout, age) {
  stopGuestUserReaper();
  log.debug('starting guest user reaper timer. timeout: %d, age: %d', timeout, age);
  var reaper = function() { require('./models/user').reapGuests(age); };
  reaperTimer = setInterval(reaper, timeout);
  reaperTimer.unref;
}

function stopGuestUserReaper() {
  if (reaperTimer) {
    log.debug('stopping guest user reaper timer. timeout: %d, age: %d', timeout, age);
    clearInterval(reaperTimer);
    reaperTimer = undefined;
  }
}

function startReaperIfValid(config) {
  var reaper = {
    frequency: 3600000,
    age: 86400000
  };
  if (config.guestUserReaper) {_.assign(reaper, config.guestUserReaper); }
  if (reaper.frequency === 0 || reaper.age === 0) {
    console.log('Guest Reaper disabled.');
  } else {
    startGuestUserReaper(reaper.frequency, reaper.age);
  }
}
