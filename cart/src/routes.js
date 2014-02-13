'use strict';

var cart = require('./controllers/cart');

module.exports = function(app, oauth) {
  app.post('/cart',
//  oauth.authenticate('customer'),
    cart.create);

  app.get('/cart',
//  oauth.authenticate('customer'),
    cart.list);

  app.get('/cart/:id',
//  oauth.authenticate('customer'),
    cart.get);

};
