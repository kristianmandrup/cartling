// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var cartItem = require('../controllers/cart-item');

module.exports = function(app) {
  var router = app.router;
  var auth = app.auth;

  var cartItems = new Resource('cartItem', {
    // POST /items
    create: function *(next) {
      yield cartItem.create(this);
    },
    // PUT /items/:id
    update: function *(next) {
      cart.update(this);
    },
    // DELETE /items/:id
    destroy: function *(next) {
      cart.close(this);
    }
  });
  return cartItems;
}
