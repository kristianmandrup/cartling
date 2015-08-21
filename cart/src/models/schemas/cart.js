var CartClass = {};

CartClass.attrs('status');

CartClass.defaults({
  status: 'open'
});

var CartItemClass = require('./cart_item');
CartClass.hasMany('items', CartItemClass);

module.exports = CartClass;
