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

var OPEN_CRITERIA = { status: 'open' };

export default function*() {
  let body = yield parse(this);
  var id = body.id;
  if (!id) { return res.json(400, 'missing id'); }
  var attributes = body;
  log.debug('%s update %j', type, req.body);
  var criteria = { _id: id };
  _.assign(criteria, OPEN_CRITERIA);
  var me = body.user;
  async.waterfall([
    function*() {
      yield me.findCartsBy(criteria, 1);
    },
    function*(carts) {
      if (carts.length === 0) { yield make404(); }
      var cart = carts[0];
      log.debug('%s found %s', type, id);
      yield verify(me, events.UPDATE, cart, attributes);
    },
    function*(cart) {
      yield cart.update(attributes);
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      log.debug('%s updated %s', type, id);
      publish(me, events.UPDATE, cart, attributes);
      res.json(cart);
  });
}
