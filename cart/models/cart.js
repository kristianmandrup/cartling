'use strict';

var _ = require('lodash');
var usergrid = require('../../common/lib/usergrid');
var validators = usergrid.validators;

usergrid.define(this, Cart);

function Cart() {
  this.validates({
    name: [ validators.required ]
  });

}
