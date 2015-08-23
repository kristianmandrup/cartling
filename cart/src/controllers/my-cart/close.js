import parse from 'co-parse';

export default function*() {
  let body = yield parse(this);
  var id = body.id;
  if (!id) { return res.json(400, 'missing id'); }
  log.debug('%s close %s', type, id);
  var criteria = { _id: id };
  _.assign(criteria, OPEN_CRITERIA);
  var me = body.user;

  async.waterfall([
    function*() {
      yield me.findCartsBy(criteria, 1);
    },
    function*(carts) {
      if (carts.length === 0) { return cb(make404()); }
      var cart = carts[0];
      log.debug('%s found %s', type, id);
      yield verify(me, events.DELETE, cart, null);
    },
    function*(cart) {
      yield cart.close;
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      log.debug('%s closed %s', type, id);
      publish(me, events.DELETE, cart);
      res.json(cart);
  });
}
