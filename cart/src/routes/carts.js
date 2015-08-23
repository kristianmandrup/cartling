// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var bodyParser = require('koa-bodyparser');
var cart = require('../controllers/cart');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var carts = new Resource('carts', {
    // GET /carts
    index: async function() {
      await cart.list(this);
    },
    // GET /carts/new
    new: async function() {
      await cart.get(this);
    },
    // POST /carts
    create: async function() {
      await cart.create(this);
    },
    // GET /carts/:id
    show: async function() {
      await cart.get(this);
    },
    // GET /carts/:id/edit
    edit: async function() {
      await cart.get(this);
    },
    // PUT /carts/:id
    update: async function() {
      await cart.update(this);
    },
    // DELETE /carts/:id
    destroy: async function() {
      await cart.close(this);
    }
  });
  var cartItems = require('./cart-items')(app);
  carts.add(cartItems);

  app.use(carts.middleware());
  app.use(bodyParser());
  return app;
}
