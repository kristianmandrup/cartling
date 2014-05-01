'use strict';

var common = require('../helpers').common;
var usergrid = common.usergrid;
var async = require('async');
var _ = require('lodash');
var CartItem = require('./cart_item');

var CartClass = {};
usergrid.define(CartClass, Cart);
module.exports = CartClass;

CartClass.attrs('status');

CartClass.defaults({
  status: 'open'
});

var CartItemClass = require('./cart_item');
CartClass.hasMany('items', CartItemClass);

function Cart() {
  this.isClosed = function() {
    return 'closed' === this.status;
  };

  this.close = function(cb) {
    this.update({ status: 'closed' }, cb);
  };

  this.copyItems = function(targetCart, cb) {
    this.getItems(function (err, items) {
      async.each(items,
        function(item, cb) {
          var newItemAttrs = _.omit(item._data, CartItem.getMetadataAttributes(true)); // create clone w/o uuid, etc
          targetCart.addItem(CartItem.new(newItemAttrs), cb);
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
