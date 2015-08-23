var helpers = require('../helpers');
var common = helpers.common;
var log = common.logger;
var events = common.events;
var errors = common.errors;
var publish = events.publish;
var findCart = require('../util').findCart;

export default async function(next) {
  try {
    this.verifyParams({
      id: 'string'
    });
    let body = yield parse(this);
    if (!body) { return this.res.json(400, 'body required'); }
    var id = this.params.id;
    var itemAttrs = body;
    let cart = await findCart(id);
    let item = CartItem.new(itemAttrs);
    await cart.addItem(item);
    publish(req.user, events.CREATE, item);
    await cart.fetchItems();
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }
}
