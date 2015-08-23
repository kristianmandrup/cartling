import parse from 'co-parse';

var common = require('../helpers').common;
var log = common.logger;
var util = common.util;

export default asyn function() {
  try {
    this.verifyParams({
      id: 'string'
    });

    let req = this.req;
    let res = this.res;

    var id = this.params.id;
    if (!id) { return res.json(400, 'missing id'); }
    var me = req.user;

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
