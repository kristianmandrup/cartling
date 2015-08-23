// See https://github.com/alexmingoia/koa-resource-router/
var Resource = require('koa-resource-router');
var bodyParser = require('koa-bodyparser');
var cart = require('../controllers/cart');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var carts = new Resource('carts', {
    // GET /carts
    index: function *(next) {
      yield cart.list(this);
    },
    // GET /carts/new
    new: function *(next) {
      yield cart.get(this);
    },
    // POST /carts
    create: function *(next) {
      yield cart.create(this);
    },
    // GET /carts/:id
    show: function *(next) {
      yield cart.get(this);
    },
    // GET /carts/:id/edit
    edit: function *(next) {
      yield cart.get(this);
    },
    // PUT /carts/:id
    update: function *(next) {
      cart.update(this);
    },
    // DELETE /carts/:id
    destroy: function *(next) {
      cart.close(this);
    }
  });
  var cartItems = require('./cart-items')(app);
  carts.add(cartItems);

  app.use(carts.middleware());
  app.use(bodyParser());
  return app;
}
