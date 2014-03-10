'use strict';

var product = require('./controllers/product');

module.exports = function(app, oauth) {

  // Product

  app.post('/products',
//    oauth.authenticate('cart'),
    product.create);

  app.get('/products',
//    oauth.authenticate('cart'),
    product.list);

  app.put('/products/:id',
//    oauth.authenticate('cart'),
    product.update);

  app.delete('/products/:id',
//    oauth.authenticate('cart'),
    product.close);
};
