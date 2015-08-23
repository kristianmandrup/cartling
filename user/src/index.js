'use strict';
var common;
var log;

export default function(config) {
  if (config) {
    common = require('cartling-common')(config);
    log = common.logger;
  }

  const reaper = require('./reaper');
  reaper.startReaperIfValid(config);

  return {
    routes: require('./routes'),
    User: require('./models/user'),
    startGuestUserReaper: reaper.startGuestUserReaper,
    stopGuestUserReaper: reaper.stopGuestUserReaper
  }
};
