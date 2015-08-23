import {Cart} from 'cartling-models';
import helpers from '../helpers';
const common = helpers.common;
const events = common.events;
const publish = common.events.publish;
const log = common.log;
const errors = common.errors;

export default async function() {
  try {
    let req = this.req;
    let res = this.res;

    let id = common.util.getId(this);
    if (!id) { return res.json(400, 'missing id'); }

    log.debug('cart close %s', id);

    var me = req.user;
    var target = req.query.merge;
    let cart = await Cart.findOne(id);
    await target ? cart.copyAndClose(target) : cart.close();
    publish(me, events.DELETE, cart);
    if (target) { publish(me, events.UPDATE, target); }
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }
}
