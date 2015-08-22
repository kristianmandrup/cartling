'use strict';

var common = require('../helpers').common;
var async = require('async');
var _ = require('lodash');
var CartItem = require('./cart_item');

class Cart {
  constructor(args) {
    this.model = new CartItem.model(args);
  }

  isClosed() {
    return this.model.status === 'closed';
  }
  close(cb) {
    this.model.update({ status: 'closed' }, cb);
  }

  copyItems(targetCart, cb) {
    this.model.getItems(function (err, items) {
      async.each(items,
        function(item, cb) {
          var newItemAttrs = _.omit(item._data, CartItem.getMetadataAttributes(true)); // create clone w/o uuid, etc
          targetCart.addItem(CartItem.new(newItemAttrs), cb);
        },
        cb);
    });
  };

  copyAndClose(targetCart, cb) {
    var self = this;
    this.copyItems(targetCart, function (err) {
      if (err) { return cb(err); }
      self.close(cb);
    });
  };
}
