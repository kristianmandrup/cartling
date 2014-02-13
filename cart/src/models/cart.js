'use strict';

var helpers = require('../helpers');
var usergrid = helpers.usergrid;
var validators = usergrid.validators;

usergrid.define(this, Cart);

function Cart() {
  this.validates({
    name: [ validators.required ]
  });

}
