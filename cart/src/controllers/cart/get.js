import parse from 'co-parse';

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
  this.verifyParams({
    id: 'string'
  });

  var id = this.params.id;
  let body = yield parse(this);

  async.waterfall([
    function*() {
      yield Cart.get(id);
    },
    function*(cart) {
      yield cart.fetchItems();
    }
  ],
  function(err, cart) {
    if (err) { sendError(res, err); }
    res.json(cart);
  });
};
