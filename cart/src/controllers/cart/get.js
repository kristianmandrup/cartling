import parse from 'co-parse';

var models = require('cartling-models');
var helpers = require('../helpers');
var common = helpers.common;

export default async function() {
  try {
    var id = common.util.getId(this);
    let cart = await Cart.get(id);
    await cart.fetchItems();
    res.json(cart);
  } catch(err) {
    common.errors.sendError(res, err);
  }
};
