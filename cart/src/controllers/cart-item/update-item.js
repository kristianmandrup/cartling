var helpers = require('../helpers');
var common = helpers.common;
var log = common.logger;
var events = common.events;
var errors = common.errors;
var publish = events.publish;
var findCart = common.util.findCart;

export default async function(next) {
  try {
    var cartId = this.params.id;
    var itemId = this.params.itemId;
    var req = this.req;
    let body = yield parse(this);
    var itemAttrs = body;

    if (!cartId) { return res.json(400, 'missing id'); }
    if (!itemId) { return res.json(400, 'missing item id'); }
    if (!itemAttrs) { return res.json(400, 'body required'); }
    var item;

    let cart = await findCart(req, cartId);
    let item = await cart.findItem(itemId);
    await item.update(itemAttrs);
    publish(req.user, events.UPDATE, item);
    cart.fetchItems();
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }
}
