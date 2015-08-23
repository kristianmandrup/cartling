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

export default async function() {
  try {
    this.verifyParams({
      id: 'string'
    });
    var id = this.params.id;
    let body = yield parse(this);
    let cart = await Cart.get(id);
    await cart.fetchItems();
    res.json(cart);
  } catch (err) {
    errors.sendError(res, err);
  }
};
