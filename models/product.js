'use strict';

function Product(args) {
  args = args || {};
  return new Product.model(args);
}
