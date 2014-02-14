'use strict';

var common = require('../helpers/common');
var usergrid = common.usergrid;
var validators = usergrid.validators;

usergrid.define(this, Cart);

function Cart() {
  this.validates({
    name: [ validators.required ]
  });

  this.isClosed = function() {
    return 'closed' === this.get('status');
  };

  this.close = function(cb) {
    // todo: state verification?
    this.set('status', 'closed');
    this.save(cb);
  };
}
