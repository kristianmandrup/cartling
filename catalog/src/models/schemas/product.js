var ProductClass = {};

ProductClass.attrs('name', 'cal', 'description', 'nutrients', 'price', 'sku');

ProductClass.validates({
  sku:      [ is.required ]
});

module.exports = ProductClass;
