'use strict';

var helpers = require('../helpers');
import parse from 'co-parse';
import models from 'cartling-models';

var Product = models.Product;

export default {
  list: function*() {
    yield Product.find();
  },

  create: function*() {
    let body = yield parse(this);
    yield Cart.create(body);
  },
  update: function*() {
    let body = yield parse(this);
    yield Cart.update(body);
  },

  get: function*() {
    let body = yield parse(this);
    yield Product.find({id: body.id});
  }
};
