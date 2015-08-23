import parse from 'co-parse';

var common = require('../helpers').common;
var log = common.logger;
var events = common.events;
var intents = common.intents;
var _ = require('lodash');
var publish = events.publish;
var verify = intents.verifyIntent;
var type = Cart._usergrid.type;
var async = require('async');
var make404 = require('../util').make404;

var OPEN_CRITERIA = { status: 'open' };

export default async function() {
  try {
    let body = yield parse(this);
    let req = this.req;
    let res = this.res;

    var id = this.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    var attributes = body;
    log.debug('%s update %j', type, attributes);
    var me = req.user;

    let carts = await me.findCartsBy({id: id});
    if (carts.length === 0) {
      errors.make404();
    }
    let cart = carts[0];
    log.debug('%s found %s', type, id);
    await cart.update(attributes);
    log.debug('%s updated %s', type, id);
    // publish(me, events.UPDATE, cart, attributes);
    res.json(cart);
  } catch(err) {
    errors.sendError(res, err);
  }

}
