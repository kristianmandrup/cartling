'use strict';

var _ = require('lodash');
var usergrid = require('./index');
var validators = require('../../lib/usergrid/validators');

// defines statics for this module and User as a type of Usergrid Entity
usergrid.define(this, User);

function User() {

  this.validates({
    username: [ validators.required ]
  });

  this.validateLogin = function(username, password, cb) {
    return this._client.login(username, password, cb);
  };
}

exports.User = User;
