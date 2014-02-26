'use strict';

var common = require('../helpers/common');
var usergrid = common.usergrid;
var async = require('async');
var _ = require('lodash');
var CartItem = require('./cart_item');
//var validators = usergrid.validators;

var CartClass = {};
usergrid.define(CartClass, Cart);
module.exports = CartClass;

CartClass.validates({
//  name: [ validators.required ]
});

CartClass.defaults({
  status: 'open'
});

var CartItemClass = require('./cart_item');
CartClass.hasMany('items', CartItemClass);

function Cart() {
  this.isClosed = function() {
    return 'closed' === this.get('status');
  };

  this.close = function(cb) {
    this.update({ status: 'closed' }, cb);
  };

  this.copyItems = function(targetCart, cb) {
    this.getItems(function (err, items) {
      async.each(items,
        function(item, cb2) {
          var newItemAttrs = _.omit(item._data, ['uuid', 'name', 'metadata']);
          CartItem.create(newItemAttrs, function (err, newItem) {
            if (err) { return cb2(err); }
            targetCart.addItem(newItem, cb2);
          });
        },
        cb);
    });
  };

  this.copyAndClose = function(targetCart, cb) {
    var self = this;
    this.copyItems(targetCart, function (err) {
      if (err) { return cb(err); }
      self.close(cb);
    });
  };
}
