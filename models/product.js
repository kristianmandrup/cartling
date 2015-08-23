'use strict';

const ProductSchema = require('./schemas/product');

class Product {
  constructor (args = {}) {
    this.schema = ProductSchema;
    this.model = new ProductSchema.model(args);
  }
}
