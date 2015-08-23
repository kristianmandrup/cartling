const common = require('../helpers').common;
const log = common.logger;
const util = common.util;
const errors = common.errors;

export default asyn function() {
  try {
    let req = this.req;
    let res = this.res;
    var me = req.user;

    let id = util.getId(this);
    if (!id) { return res.json(400, 'missing id'); }

    let carts = await me.findCartsBy({id: id});
    if (carts.length === 0) {
      errors.make404();
    }
    let cart = carts[0];
    let items = await cart.fetchItems();
    // log.debug('%s found %s', type, id);
    res.json(cart);
  } catch (err) {
    errors.sendError(res, err);
  }
}
