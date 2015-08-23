var models = require('cartling-models');
var helpers = require('../helpers');
var common = helpers.common;
var log = common.logger;
var events = common.events;
var errors = common.errors;
var publish = events.publish;
var findCart = common.util.findCart;

export default async function(next) {
  try {
    this.verifyParams({
      id: 'string'
    });
    // let body = yield parse(this);
    var cartId = this.params.id;
    var itemId = this.params.itemId;
    if (!cartId) { return res.json(400, 'missing id'); }
    if (!itemId) { return res.json(400, 'missing item id'); }

    let cart = await findCart(req, cartId);
    let item = await cart.findItem(itemId);
    await cart.deleteItem(itemId);
    publish(req.user, events.DELETE, item);
    await cart.fetchItems();
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }
}
