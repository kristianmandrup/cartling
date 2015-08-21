var UserClass;

UserClass.validates({
  guest:    [ is.boolean ]
});

// deletes all Users less fresh than age
// age is time in ms since record was last modified
// cb is optional
// uses direct delete by query: does not retrieve or do any callbacks
// warning: accuracy of this relies on time sync with server
UserClass.reapGuests = function(age, cb) {
  if (!_.isNumber(age)) { throw new Error('age is required'); }
  log.debug('guest user reaper starting');
  var olderThan = new Date().getTime() - age;
  var query = 'guest=true and modified<' + olderThan;
  this.deleteAll(query, function (err, reply) {
    if (!err) { log.debug('guest user reaper deleted %d users', reply); }
    if (cb) { return cb(err, reply); }
    if (err) { log.error('guest user reaper failed %s', err); }
  });
};

module.exports = UserClass;
