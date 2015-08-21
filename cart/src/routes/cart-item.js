var cartItem = require('./controllers/cart_item');

module.exports = function(app, oauth) {
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
