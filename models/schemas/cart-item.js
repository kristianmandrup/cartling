var keystone = require('keystone'),
    Types = keystone.Field.Types;

var CartItem = new keystone.List('CartItem', {
    autokey: { path: 'slug', from: 'product.sku', unique: true },
    defaultSort: '+product.sku'
});

CartItem.add({
    quantity: { type: Number, required: true, default: 1 },
    product: { type: Types.Relationship, ref: 'Product' }
});

module.exports = CartItem;
