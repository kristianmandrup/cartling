import parse from 'co-parse';

module.exports = function*() {
  async.waterfall([
    function*() {
      let body = yield parse(this);
      yield Cart.get(body.id);
    },
    function*(cart) {
      yield cart.fetchItems();
    }
  ],
  function(err, cart) {
    if (err) { sendError(res, err); }
    res.json(cart);
  });
};
