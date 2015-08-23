var models = require('cartling-models');
var helpers = require('../helpers');
var log = helpers.common.logger;
var events = helpers.common.events;
var _ = require('lodash');
var publish = events.publish;
var intents = helpers.common.intents;
var verify = intents.verifyIntent;
var async = require('async');

export default function*() {
    let body = yield parse(this);
    this.verifyParams({
      id: 'string'
    });

    var id = this.params.id;
    if (!id) { return res.json(400, 'missing id'); }

    log.debug('cart close %s', id);

    var me = this.req.user;
    var target = this.req.query.merge;

    async.waterfall([
      function*() {
        yield Cart.findOne(id);
      },
      function*(cart) {
        verify(me, intents.DELETE, cart, { merge: target });
      },
      function*(cart) {
        if (target) {
          yield cart.copyAndClose(target);
        } else {
          yield cart.close();
        }
      }
    ],
      function(err, cart) {
        publish(me, events.DELETE, cart);
        if (target) { publish(me, events.UPDATE, target); }
        if (err) { sendError(res, err); }
        res.json(cart);
      });
  }
};
