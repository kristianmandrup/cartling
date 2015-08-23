export default function*(next) {
  let body = yield parse(this);
  if (!body) { return this.res.json(400, 'body required'); }
  var id = this.params.id;
  var itemAttrs = body;
  var item;

  async.waterfall([
    function*() {
      yield findCart(id);
    },
    function*(cart) {
      item = CartItem.new(itemAttrs);
      yield verify(req.user, intents.CREATE, item, { cart: cart });
    },
    function*(cart) {
      yield cart.addItem(item);
    },
    function*(cart) {
      publish(req.user, events.CREATE, item);
      yield cart.fetchItems();
    }
  ],
  function(err, cart) {
    if (err) { sendError(res, err); }
    res.json(cart);
  });
}
