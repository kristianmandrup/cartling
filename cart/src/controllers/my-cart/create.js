import parse from 'co-parse';
import {Cart} from 'cartling-models';

export default function*(next) {
  let body = yield parse(this);
  let req = this.req;
  let res = this.res;

  async.waterfall([
    function() {
      Cart.create(body);
    },
    function*(cart) {
      var me = req.user;
      yield me.addCart(cart);
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      res.json(cart);
  });
}
