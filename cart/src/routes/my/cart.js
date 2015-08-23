var mycart = require('./controllers/my-cart');
var bodyParser = require('koa-bodyparser');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var mycart = new Resource('mycart', {
    // GET /mycart
    index: async function() {
      await mycart.list(this);
    },
    // GET /mycart/new
    new: async function() {
      await mycart.get(this);
    },
    // POST /mycart
    create: async function() {
      await mycart.create(this);
    },
    // GET /mycart/:id
    show: async function() {
      await mycart.get(this);
    },
    // GET /mycart/:id/edit
    edit: async function() {
      await mycart.get(this);
    },
    // PUT /mycart/:id
    update: async function() {
      await mycart.update(this);
    },
    // DELETE /mycart/:id
    destroy: async function() {
      await mycart.close(this);
    }
  });
  var cartItems = require('../cart-items')(app);
  mycart.add(cartItems);
  app.use(mycart.middleware());
  app.use(bodyParser());
  return app;
}
