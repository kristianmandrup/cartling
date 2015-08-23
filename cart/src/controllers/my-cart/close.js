const helpers = require('../helpers');
const common = helpers.common;
const log = common.logger;
const events = common.events;
const errors = common.errors;
const publish = events.publish;
const util = common.util;

export default async function() {
  try {
    let req = this.req;
    let res = this.res;

    let id = util.getId(this);
    if (!id) { return res.json(400, 'missing id'); }

    log.debug('%s close %s', type, id);
    var me = req.user;
    let carts = await me.findCartsBy({id: id});
    if (carts.length === 0) {
      return errors.make404();
    }
    var cart = carts[0];
    log.debug('%s found %s', type, id);
    cart = await cart.close();
    log.debug('%s closed %s', type, id);
    publish(me, events.DELETE, cart);
    return res.json(cart);
  } catch (err) {
    errors.sendError(res, err);
  }
}
