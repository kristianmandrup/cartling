'use strict';

var common = require('../helpers').common;
var async = require('async');
var _ = require('lodash');
var CartItem = require('./cart_item');

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
