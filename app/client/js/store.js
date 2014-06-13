'use strict';

//----------------------------------------------------------------
// store (contains the products)
//
// NOTE: nutritional info from http://www.cspinet.org/images/fruitcha.jpg
// score legend:
// 0: below 5% of daily value (DV)
// 1: 5-10% DV
// 2: 10-20% DV
// 3: 20-40% DV
// 4: above 40% DV
//
function Store(Phrixus) {

  Object.defineProperty(this, "products", {
    get: function() { return this.getProducts(); }
  });

  this.dvaCaption = [
    "Negligible",
    "Low",
    "Average",
    "Good",
    "Great"
  ];
  this.dvaRange = [
    "below 5%",
    "between 5 and 10%",
    "between 10 and 20%",
    "between 20 and 40%",
    "above 40%"
  ];

  this.getProducts = function() {
    if (!this.prods) {
      this.prods = Phrixus.Product.query();
    }
    return this.prods;
  };

  this.getProduct = function(sku) {
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].sku === sku) {
        return this.products[i];
      }
    }
    return null;
  };

}
