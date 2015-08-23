import parse from 'co-parse';

export default function*() {
  let body = yield parse(this);

  log.debug('my cart list');
  var me = body.user;
  var criteria = req.query || {};
  _.assign(criteria, OPEN_CRITERIA);
  me.findCartsBy(criteria, function(err, carts) {
    if (err) { sendError(res, err); }

    async.each(carts,
      function*(cart) {
        yield cart.fetchItems();
      },
      function*(err) {
        if (err) { yield sendError(res, err); }
        yield res.json(carts);
      }
    );
  });
}
