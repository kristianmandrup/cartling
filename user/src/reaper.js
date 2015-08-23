var _ = require('lodash');
var reaperTimer;

export function startGuestUserReaper(timeout, age) {
  stopGuestUserReaper();
  log.debug('starting guest user reaper timer. timeout: %d, age: %d', timeout, age);
  var reaper = function() { require('./models/user').reapGuests(age); };
  reaperTimer = setInterval(reaper, timeout);
  reaperTimer.unref;
}

export function stopGuestUserReaper() {
  if (reaperTimer) {
    log.debug('stopping guest user reaper timer. timeout: %d, age: %d', timeout, age);
    clearInterval(reaperTimer);
    reaperTimer = undefined;
  }
}

export function startReaperIfValid(config) {
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
