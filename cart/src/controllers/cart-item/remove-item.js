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
  let body = yield parse(this);

  this.verifyParams({
    id: 'string'
  });

  var cartId = this.params.id;
  var itemId = this.params.itemId;
  if (!cartId) { return res.json(400, 'missing id'); }
  if (!itemId) { return res.json(400, 'missing item id'); }
  var item;
  async.waterfall([
    function*() {
      yield findCart(req, cartId);
    },
    function(cart) {
      yield cart.findItem(itemId);
    },
    function*(cart) {
      yield verify(req.user, intents.DELETE, item, { cart: cart });
    },
    function*(cart) {
      yield cart.deleteItem(itemId);
    },
    function*(cart) {
      publish(req.user, events.DELETE, item);
      yield cart.fetchItems();
    }
  ],
    function(err, cart) {
      if (err) { sendError(res, err); }
      res.json(cart);
    });
}
