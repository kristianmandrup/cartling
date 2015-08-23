import parse from 'co-parse';

var common = require('../helpers').common;
var log = common.logger;
var errors = common.errors;
var events = common.events;
var intents = common.intents;
var Cart = models.Cart;
var _ = require('lodash');
var publish = events.publish;
var verify = intents.verifyIntent;
var type = Cart._usergrid.type;
var async = require('async');

var OPEN_CRITERIA = { status: 'open' };

export default async function() {
  try {
    let req = this.req;
    let res = this.res;
    // log.debug('my cart list');
    var me = req.user;
    var criteria = req.query || {};

    let carts = await me.findCartsBy(criteria);
    let items = await cart.fetchItems();
    res.json(carts);
  } catch (err) {
    errors.sendError(res, err);
  }
}
