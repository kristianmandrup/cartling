import parse from 'co-parse';

var common = require('../helpers').common;
var log = common.logger;
var events = common.events;
var errors = common.errors;
var publish = events.publish;
var verify = intents.verifyIntent;

export default async function() {
  try {
    let req = this.req;
    let res = this.res;

    this.verifyParams({
      id: 'string'
    });
    // let body = yield parse(this);
    var id = this.params.id;

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
    // publish(me, events.DELETE, cart);
    return res.json(cart);
  } catch (err) {
    errors.sendError(res, err);
  }
}
