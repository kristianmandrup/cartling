var models = require('cartling-models');
var helpers = require('../helpers');
var log = helpers.common.logger;
var events = helpers.common.events;
var _ = require('lodash');
var publish = events.publish;
var intents = helpers.common.intents;
var verify = intents.verifyIntent;
var async = require('async');
var findCart = require('../util').findCart;

export default function*(next) {
  var cartId = this.params.id;
  var itemId = this.params.itemId;
  var req = this.req;
  let body = yield parse(this);
  var itemAttrs = body;

  if (!cartId) { return res.json(400, 'missing id'); }
  if (!itemId) { return res.json(400, 'missing item id'); }
  if (!itemAttrs) { return res.json(400, 'body required'); }
  var item;

  async.waterfall([
    function*() {
      yield findCart(req, cartId);
    },
    function*(cart) {
      yield cart.findItem(itemId);
    },
    function*(cart) {
      yield verify(body.user, intents.UPDATE, item, itemAttrs);
    },
    function*(cart) {
      yield item.update(itemAttrs);
    },
    function*(cart) {
      publish(req.user, events.UPDATE, item);
      yield cart.fetchItems();
    }
  ],
    function(err, cart) {
      if (err) { sendError(res, err); }
      res.json(cart);
    });
}
