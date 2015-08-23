import parse from 'co-parse';

export default function*() {
  let body = yield parse(this);
  async.waterfall([
    function() {
      Cart.create(body);
    },
    function*(cart) {
      var me = body.user;
      yield me.addCart(cart);
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      res.json(cart);
  });
}
