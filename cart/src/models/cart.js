'use strict';

var common = require('../helpers/common');
var usergrid = common.usergrid;
var validators = usergrid.validators;
var ITEMS_CONNECTION_NAME = 'items';

var CartClass = {};
usergrid.define(CartClass, Cart);
module.exports = CartClass;

CartClass.validates({
  name: [ validators.required ]
});

function Cart() {
  this.isClosed = function() {
    return 'closed' === this.get('status');
  };

  this.close = function(cb) {
    this.set('status', 'closed');
    this.save(cb);
  };

  this.addItem = function(item, cb) {
    this.connect(ITEMS_CONNECTION_NAME, item, function(err, reply) {
      cb(err, item);
    });
  };

  this.removeItem = function(item, cb) {
    this.disconnect(ITEMS_CONNECTION_NAME, item, function(err, reply) {
      cb(err, item);
    });
  };

  this.getItems = function(cb) {
    this.getConnections(ITEMS_CONNECTION_NAME, cb);
  };

}
