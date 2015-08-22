var keystone = require('keystone'),
    Types = keystone.Field.Types;

var CartItem = require('./cart-item');

var Cart = new keystone.List('Cart', {
    defaultSort: '+status'
});

Cart.add({
    status: { type: String, required: true, default: 'open' },
    items: [CartItem]
});

module.exports = CartItem;
