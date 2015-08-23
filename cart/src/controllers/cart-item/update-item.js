function findCart*(id) {
  yield Cart.findOne(id);
}

export default function*(next) {
  var cartId = this.params.id;
  var itemId = this.params.itemId;
  let body = yield parse(this);
  var itemAttrs = body;
  if (!cartId) { return res.json(400, 'missing id'); }
  if (!itemId) { return res.json(400, 'missing item id'); }
  if (!itemAttrs) { return res.json(400, 'body required'); }
  var item;
  async.waterfall([
    function*() {
      yield findCart(cartId);
    },
    function*(cart) {
      yield cart.findItem(itemId);
    },
    function*(cart) {
      yield verify(body.user, intents.UPDATE, item, itemAttrs);
    },
    function*(cart) {
      yield item.update(itemAttrs);
    },
    function*(cart) {
      publish(req.user, events.UPDATE, item);
      yield cart.fetchItems();
    }
  ],
    function(err, cart) {
      if (err) { sendError(res, err); }
      res.json(cart);
    });
}
