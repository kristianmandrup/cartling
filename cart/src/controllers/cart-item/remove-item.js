const helpers = require('../helpers');
const common = helpers.common;
const log = common.logger;
const events = common.events;
const errors = common.errors;
const publish = events.publish;
const util = common.util;

export default async function(next) {
  try {
    let req = this.req;
    let res = this.res;
    
    let cartId = util.getId(this);
    if (!cartId) { return res.json(400, 'missing id'); }

    let itemId = util.getItemId(this);
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
