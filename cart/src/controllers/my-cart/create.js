import {Cart} from 'cartling-models';
var common = require('../helpers').common;
var log = common.logger;
var errors = common.errors;

export default async function(next) {
  try {
    let req = this.req;
    let res = this.res;
    
    let cart = await Cart.create(req.body);
    cart = await req.user.addCart(cart);
    // TODO: publish event and log
    // log.debug('%s created %s', type, id);
    // publish(me, events.CREATE, cart);
    return res.json(cart);
  } catch (err) {
    errors.sendError(res, err);
  }
}
