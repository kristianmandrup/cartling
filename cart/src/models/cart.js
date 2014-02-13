'use strict';

var usergrid = require('../helpers').usergrid;
var validators = usergrid.validators;

usergrid.define(this, Cart);

function Cart() {
  this.validates({
    name: [ validators.required ]
  });

}
