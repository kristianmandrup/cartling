'use strict';

const CartItemSchema = require('./schemas/cart-item');

class CartItem {
  constructor(args = {}) {
    this.schema = CartItemSchema;
    this.model = new CartItemSchema.model(args);
  }
}
