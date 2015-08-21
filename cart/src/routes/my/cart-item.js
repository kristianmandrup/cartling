var cartItem = require('./controllers/cart_item');

module.exports = function(app, oauth) {
  app.post('/my/carts/:id/items',
    oauth.authenticate('mycart'),
    cartItem.addItem);

  app.put('/my/carts/:id/items/:itemId',
    oauth.authenticate('mycart'),
    cartItem.updateItem);

  app.delete('/my/carts/:id/items/:itemId',
    oauth.authenticate('mycart'),
    cartItem.removeItem);
}
