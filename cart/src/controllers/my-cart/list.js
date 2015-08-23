const common = require('../helpers').common;
const log = common.logger;
const util = common.util;
const errors = common.errors;

export default async function() {
  try {
    let req = this.req;
    let res = this.res;
    log.debug('my cart list');
    var me = req.user;
    var criteria = req.query || {};

    let carts = await me.findCartsBy(criteria);
    let items = await cart.fetchItems();
    res.json(carts);
  } catch (err) {
    errors.sendError(res, err);
  }
}
