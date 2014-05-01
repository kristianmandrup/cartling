'use strict';

var _ = require('lodash');
var async = require('async');

module.exports = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',

  before: before,

  clearAll: clearAll,
  verifyIntent: verifyIntent
};

var registeredListeners;
clearAll();

/*
 register for a callback before an action
 op: 'create' | 'read' | 'update' | 'delete' | '*'
 type: '<explicit type>' | '*'
 listener signature is: function(intent, done)
 listener function must call done() to continue, or done(err) to abort the action
 note: if more than one listener is registered for an action, listeners will be called asynchronously and the first
       error (if any) will be binding, so there is no guarantee any particular listener will be called
 }
 */
function before(op, type, listener) {
  if (!_.isFunction(listener)) { throw new Error('Callback must be a function'); }
  if (!registeredListeners[op][type]) { registeredListeners[op][type] = []; }
  registeredListeners[op][type].push(listener);
}


// schema: { create: { user: [ listener ] } }
function clearAll() {
  registeredListeners = {
    create: {},
    read: {},
    update: {},
    delete: {}
  };
  registeredListeners['*'] = {};
}

// todo: protect/freeze the attributes?
function Intent(subject, op, target, data) {
  this.subject = subject;
  this.op = op;             // create | read | update | delete
  this.target = target;
  this.data = data;
}

function listenersFor(op, type) {
  var exact = registeredListeners[op] ? registeredListeners[op][type] : undefined;
  var typeWild = registeredListeners[op] ? registeredListeners[op]['*'] : undefined;
  var opWild = registeredListeners['*'] ? registeredListeners['*'][type] : undefined;
  var allWild = registeredListeners['*'] ? registeredListeners['*']['*'] : undefined;
  return _.union(exact, typeWild, opWild, allWild);
}


// callback is just: function(err)
// if err, action should be abandoned & error is propogated
// no data is allowed to be changed by the function
function verifyIntent(subject, op, target, data, cb) {
  var type = (_.isString(target)) ? target : target.type;
  var listeners = listenersFor(op, type);
  if (listeners.length === 0) { return cb(); }
  if (data && data.uuid) { delete(data.uuid); } // uuid is immutable, so don't include - even if it's in the data
  var intent = new Intent(subject, op, target, data);
  async.each(listeners,
    function(listener, callback) {
      try {
        listener(intent, callback);
      } catch (err) {
        cb(err);
      }
    },
    function(err) {
      cb(err, target);
    }
  );
}
