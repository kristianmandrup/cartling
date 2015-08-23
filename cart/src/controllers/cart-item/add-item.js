var helpers = require('../helpers');
const common = helpers.common;
const log = common.logger;
const util = common.util;
const errors = common.errors;
const publish = events.publish;

export default async function(next) {
  try {
    let req = this.req;
    let res = this.res;
    
    if (!res.body) { return this.res.json(400, 'body required'); }
    var id = util.getId(this);
    var itemAttrs = req.body;
    let cart = await util.findCart(id);
    let item = CartItem.new(itemAttrs);
    await cart.addItem(item);
    publish(req.user, events.CREATE, item);
    await cart.fetchItems();
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }
}
