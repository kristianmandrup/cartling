'use strict';

var cart = require('./controllers/cart');
var cartItem = require('./controllers/cart_item');
var mycart = require('./controllers/my_cart');
var usergridMiddleware = require('./helpers').common.usergrid.expressMiddleware;

module.exports = function(app, oauth) {

  // My Cart (logged in user's carts)

  app.post('/my/carts',
    oauth.authenticate('cart'),
    usergridMiddleware,
    mycart.create);

  app.get('/my/carts',
    oauth.authenticate('cart'),
    usergridMiddleware,
    mycart.list);

  app.get('/my/carts/:id',
    oauth.authenticate('cart'),
    usergridMiddleware,
    mycart.get);

  app.put('/my/carts/:id',
    oauth.authenticate('cart'),
    usergridMiddleware,
    mycart.update);

  app.delete('/my/carts/:id',
    oauth.authenticate('cart'),
    usergridMiddleware,
    mycart.close);

  app.post('/my/carts/:id/items',
    oauth.authenticate('cart'),
    cartItem.addItem);

  app.put('/my/carts/:id/items/:itemId',
    oauth.authenticate('cart'),
    cartItem.updateItem);

  app.delete('/my/carts/:id/items/:itemId',
    oauth.authenticate('cart'),
    cartItem.removeItem);


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


  app.post('/carts/:id/items',
    oauth.authenticate('cart'),
    cartItem.addItem);

  app.put('/carts/:id/items/:itemId',
    oauth.authenticate('cart'),
    cartItem.updateItem);

  app.delete('/carts/:id/items/:itemId',
    oauth.authenticate('cart'),
    cartItem.removeItem);
};
