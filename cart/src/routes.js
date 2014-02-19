'use strict';

var cart = require('./controllers/cart');
var cartItem = require('./controllers/cart_item');

module.exports = function(app, oauth) {

  // Cart

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
