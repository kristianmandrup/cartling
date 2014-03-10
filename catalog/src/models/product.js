'use strict';

var common = require('../helpers').common;
var usergrid = common.usergrid;
var is = usergrid.validators;

var ProductClass = {};
usergrid.define(ProductClass, Product);
module.exports = ProductClass;

ProductClass.validates({
  sku:      [ is.required ]
});

function Product() {
}
