import {Cart} from 'cartling-models';
import helpers from '../helpers';
const common = helpers.common;
const publish = common.events.publish;

export default async function() {
  try {
    var id = common.util.getId(this);
    if (!id) { return res.json(400, 'missing id'); }

    log.debug('cart close %s', id);

    var me = this.req.user;
    var target = this.req.query.merge;
    let cart = await Cart.findOne(id);
    await target ? cart.copyAndClose(target) : cart.close();
    publish(me, events.DELETE, cart);
    if (target) { publish(me, events.UPDATE, target); }
    res.json(cart);
  } catch(err) {
    common.errors.sendError(res, err);
  }
}
