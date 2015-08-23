const common = require('../helpers').common;
const log = common.logger;
const util = common.util;
const errors = common.errors;

export default async function() {
  try {
    let req = this.req;
    let res = this.res;

    var id = util.getId(this);
    if (!id) { return res.json(400, 'missing id'); }

    var attributes = req.body;
    log.debug('%s update %j', id, attributes);
    var me = req.user;

    let carts = await me.findCartsBy({id: id});
    if (carts.length === 0) {
      errors.make404();
    }
    let cart = carts[0];
    log.debug('%s found %s', type, id);
    await cart.update(attributes);
    log.debug('%s updated %s', type, id);
    publish(me, events.UPDATE, cart, attributes);
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }
}
