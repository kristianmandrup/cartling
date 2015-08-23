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
    function(cb) {
      findCart(req, cartId, cb);
    },
    function(cart, cb) {
      cart.findItem(itemId, function(err, reply) {
        item = reply;
        cb(err, cart);
      });
    },
    function(cart, cb) {
      verify(req.user, intents.DELETE, item, { cart: cart }, function(err) {
        cb(err, cart);
      });
    },
    function(cart, cb) {
      cart.deleteItem(itemId, cb);
    },
    function(cart, cb) {
      publish(req.user, events.DELETE, item);
      cart.fetchItems(cb);
    }
  ],
    function(err, cart) {
      if (err) { sendError(res, err); }
      res.json(cart);
    });
}
