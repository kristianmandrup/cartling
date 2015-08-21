var cart = require('./controllers/cart');

module.exports = function(app, oauth) {
  // Cart (direct, no context)
  app.post('/carts',
    oauth.authenticate('cart'),
    cart.create);

  app.get('/carts',
    oauth.authenticate('cart'),
    cart.list);

  app.get('/carts/:id',
    oauth.authenticate('cart'),
    cart.get);

  app.put('/carts/:id',
    oauth.authenticate('cart'),
    cart.update);

  app.delete('/carts/:id',
    oauth.authenticate('cart'),
    cart.close);
}
