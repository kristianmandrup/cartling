// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var cartItem = require('../controllers/cart-item');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var cartItems = new Resource('cartItem', {
    // POST /items
    create: async function(next) {
      await cartItem.create(this);
    },
    // PUT /items/:id
    update: async function(next) {
      await cart.update(this);
    },
    // DELETE /items/:id
    destroy: async function(next) {
      await cart.close(this);
    }
  });
  return cartItems;
}
