var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Product = new keystone.List('Product', {
    autokey: { path: 'slug', from: 'sku', unique: true },
    map: { name: 'title' },
    defaultSort: '+sku'
});

Product.add({
    title: { type: String, required: true },
    description: { type: Types.Markdown, required: true },
    // https://en.wikipedia.org/wiki/Stock_keeping_unit
    // Stock Keeping Unit
    // SKU can refer to a unique identifier or code that refers to the particular stock keeping unit.
    sku: { type: String, required: true },
    price: { type: Types.Money, currency: 'en-gb' }
});

module.exports = Product;
