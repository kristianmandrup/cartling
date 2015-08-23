'use strict';

var Cart = models.Cart;

export default {
  create: function*(args) {
    yield Cart.create(args);
  },
  update: function*(args) {
    yield Cart.update(args);
  },
  list: function*() {
    yield Cart.find();
  },
  get: require('./cart/get'),
  close: require('./cart/close')
}
