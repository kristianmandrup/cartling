import parse from 'co-parse';

export default function*() {
  let body = yield parse(this);

  var id = body.id;
  if (!id) { return res.json(400, 'missing id'); }
  var criteria = { _id: id };
  _.assign(criteria, OPEN_CRITERIA);
  var me = body.user;

  async.waterfall([
    function*() {
      yield me.findCartsBy(criteria, 1);
    },
    function*(carts) {
      if (carts.length === 0) { yield make404(); }
      yield carts[0];
    },
    function*(cart) {
      yield cart.fetchItems();
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      log.debug('%s found %s', type, id);
      res.json(cart);
  });
}
