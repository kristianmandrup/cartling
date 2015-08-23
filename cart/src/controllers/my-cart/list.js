import parse from 'co-parse';

var common = require('../helpers').common;
var log = common.logger;
var events = common.events;
var intents = common.intents;
var Cart = models.Cart;
var _ = require('lodash');
var publish = events.publish;
var verify = intents.verifyIntent;
var type = Cart._usergrid.type;
var async = require('async');

var OPEN_CRITERIA = { status: 'open' };

export default function*() {
  let body = yield parse(this);

  log.debug('my cart list');
  var me = body.user;
  var criteria = req.query || {};
  _.assign(criteria, OPEN_CRITERIA);
  me.findCartsBy(criteria, function(err, carts) {
    if (err) { sendError(res, err); }

    async.each(carts,
      function*(cart) {
        yield cart.fetchItems();
      },
      function*(err) {
        if (err) { yield sendError(res, err); }
        yield res.json(carts);
      }
    );
  });
}
