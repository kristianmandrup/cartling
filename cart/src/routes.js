'use strict';

var cart = require('./controllers/cart');
var cartItem = require('./controllers/cart_item');

module.exports = function(app, oauth) {

  // Cart

  app.post('/cart',
//  oauth.authenticate('customer'),
    cart.create);

  app.get('/cart',
//  oauth.authenticate('customer'),
    cart.list);

  app.get('/cart/:id',
//  oauth.authenticate('customer'),
    cart.get);

  app.put('/cart/:id',
//  oauth.authenticate('customer'),
    cart.update);

  app.delete('/cart/:id',
//  oauth.authenticate('customer'),
    cart.close);


  // CartItems

  app.get('/cart/:cartId/item/:id',
//  oauth.authenticate('customer'),
    cartItem.get);

  app.put('/cart/:cartId/item/:id',
//  oauth.authenticate('customer'),
    cartItem.update);

  app.delete('/cart/:cartId/item/:id',
//  oauth.authenticate('customer'),
    cartItem.close);
};
