'use strict';

var cart = require('./controllers/cart');
var cartItem = require('./controllers/cart_item');
var mycart = require('./controllers/my_cart');

module.exports = function(app, oauth) {

  // My Cart (logged in user's carts)

  app.post('/my/carts',
    oauth.authenticate('cart'),
    addUserContext,
    mycart.create);

  app.get('/my/carts',
    oauth.authenticate('cart'),
    addUserContext,
    mycart.list);

  app.get('/my/carts/:id',
    oauth.authenticate('cart'),
    addUserContext,
    mycart.get);

  app.put('/my/carts/:id',
    oauth.authenticate('cart'),
    addUserContext,
    mycart.update);

  app.delete('/my/carts/:id',
    oauth.authenticate('cart'),
    addUserContext,
    mycart.close);


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


  // CartItems

  app.post('/carts/:cartId/items',
    oauth.authenticate('cart'),
    cartItem.create);

  app.put('/carts/:cartId/items/:id',
    oauth.authenticate('cart'),
    cartItem.update);

  app.delete('/carts/:cartId/items/:id',
    oauth.authenticate('cart'),
    cartItem.delete);
};


// retrieve the username & instantiate User for context
var User = require('./models').User;
function addUserContext(req, res, next) {
  var username = req.token.attributes.username;
  req.token.user = User.new({ username: username });
  next();
}
