'use strict';

var product = require('./controllers/product');

module.exports = function(app, oauth) {

  // Product

  app.get('/products',
    oauth.authenticate('cart'),
    product.list);

//  app.post('/products',
////    oauth.authenticate('cart'),
//    product.create);
//
//  app.put('/products/:id',
////    oauth.authenticate('cart'),
//    product.update);
//
//  app.delete('/products/:id',
////    oauth.authenticate('cart'),
//    product.delete);
};
