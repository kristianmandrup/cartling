var models = require('cartling-models');
var helpers = require('../helpers');
var log = helpers.common.logger;
var events = helpers.common.events;
var _ = require('lodash');
var publish = events.publish;
var intents = helpers.common.intents;
var verify = intents.verifyIntent;
var async = require('async');

export default function*(next) {
  this.verifyParams({
    id: 'string'
  });

  let body = yield parse(this);
  if (!body) { return this.res.json(400, 'body required'); }
  var id = this.params.id;
  var itemAttrs = body;
  var item;

  async.waterfall([
    function*() {
      yield findCart(id);
    },
    function*(cart) {
      item = CartItem.new(itemAttrs);
      yield verify(req.user, intents.CREATE, item, { cart: cart });
    },
    function*(cart) {
      yield cart.addItem(item);
    },
    function*(cart) {
      publish(req.user, events.CREATE, item);
      yield cart.fetchItems();
    }
  ],
  function(err, cart) {
    if (err) { sendError(res, err); }
    res.json(cart);
  });
}
