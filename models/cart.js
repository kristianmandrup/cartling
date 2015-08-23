'use strict';

var common = require('../helpers').common;
var async = require('async');
var _ = require('lodash');

const CartItem = require('./cart-item');
const CartSchema = require('./schemas/cart');

class Cart {
  constructor(args = {}) {
    this.schema = CartSchema;
    this.model = new CartSchema.model(args);
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
          targetCart.addItem(CartItem.new(item.attributes, cb);
        },
        cb);
    });
  }

  copyAndClose(targetCart, cb) {
    var self = this;
    this.copyItems(targetCart, function (err) {
      if (err) { return cb(err); }
      self.close(cb);
    });
  }
}
