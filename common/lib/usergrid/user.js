'use strict';

var _ = require('lodash');
var usergrid = require('./index')();
var validators = usergrid.validators;
var helpers = require('./helpers');

// defines statics for this module and User as a type of Usergrid Entity
var UserClass = {};
usergrid.define(UserClass, User);
module.exports = UserClass;

UserClass.validates({
  username: [ validators.required ]
});


function User() {

  // cb reply returns token
  this.getAccessToken = function(password, cb) {
    var options = {
      method: 'POST',
      endpoint: 'token',
      body: {
        username: this.get('username'),
        password: password,
        grant_type: 'password'
      }
    };
    helpers.request(options, cb);
  };
}

exports.User = User;
