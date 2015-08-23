var mycart = require('./controllers/my-cart');

export default function(app) {
  var router = app.router;
  var auth = app.auth;

  var mycart = new Resource('mycart', {
    // GET /mycart
    index: function *(next) {
      yield mycart.list(this);
    },
    // GET /mycart/new
    new: function *(next) {
      yield mycart.get(this);
    },
    // POST /mycart
    create: function *(next) {
      yield mycart.create(this);
    },
    // GET /mycart/:id
    show: function *(next) {
      yield mycart.get(this);
    },
    // GET /mycart/:id/edit
    edit: function *(next) {
      yield mycart.get(this);
    },
    // PUT /mycart/:id
    update: function *(next) {
      mycart.update(this);
    },
    // DELETE /mycart/:id
    destroy: function *(next) {
      mycart.close(this);
    }
  });
  var cartItems = require('../cart-items')(app);
  mycart.add(cartItems);
  app.use(mycart.middleware());

  return app;
}
}
