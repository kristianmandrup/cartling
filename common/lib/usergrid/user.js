'use strict';

var _ = require('lodash');
var usergrid = require('./index')();
var validators = usergrid.validators;
var helpers = require('./helpers');

// defines statics for this module and User as a type of Usergrid Entity
var UserClass = {};
usergrid.define(UserClass, User);
module.exports = UserClass;

UserClass.attrs('username', 'activated');

UserClass.validates({
  username: [ validators.required ]
});

// cb reply returns token
UserClass.getAccessToken = function(username, password, cb) {
  var u = this.new({ username: username});
  u.getAccessToken(password, cb);
};

UserClass.findOrCreate = function(criteria, cb) {
  var self = this;
  var findCriteria = _.omit(criteria, 'password');
  this.first(findCriteria, function(err, entity) {
    if (err) { return cb(err); }
    if (entity) {
      cb(null, entity);
    } else {
      self.create(criteria, cb);
    }
  });
};

function User() {

  // cb reply returns token
  this.getAccessToken = function(password, cb) {
    var options = {
      method: 'POST',
      endpoint: 'token',
      body: {
        username: this.username,
        password: password,
        grant_type: 'password'
      }
    };
    helpers.request(options, cb);
  };
}

exports.User = User;
