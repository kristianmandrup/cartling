var mycart = require('./controllers/my_cart');

module.exports = function(app, oauth) {
  // My Cart (logged in user's carts)
  app.post('/my/carts',
    oauth.authenticate('mycart'),
    mycart.create);

  app.get('/my/carts',
    oauth.authenticate('mycart'),
    mycart.list);

  app.get('/my/carts/:id',
    oauth.authenticate('mycart'),
    mycart.get);

  app.put('/my/carts/:id',
    oauth.authenticate('mycart'),
    mycart.update);

  app.delete('/my/carts/:id',
    oauth.authenticate('mycart'),
    usergridMiddleware,
    mycart.close);
}
