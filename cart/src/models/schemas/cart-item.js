var CartItemClass = {};

CartItemClass.attrs('sku', 'quantity');

CartItemClass.validates({
  sku:      [ is.required ],
  quantity: [ is.required, is.numeric ]
});

CartItemClass.defaults({
  quantity: 1
});

module.exports = CartItemClass;
