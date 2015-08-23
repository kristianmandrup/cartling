module.exports = function*() {
    let body = yield parse(this);
    var id = body.id;
    if (!id) { return res.json(400, 'missing id'); }
    log.debug('cart close %s', id);
    var me = body.user;
    var target = this.req.query.merge;
    async.waterfall([
      function(cb) {
        Cart.find(id, cb);
      },
      function(cart, cb) {
        verify(me, intents.DELETE, cart, { merge: target }, function(err) {
          cb(err, cart);
        });
      },
      function(cart, cb) {
        if (target) {
          cart.copyAndClose(target, cb);
        } else {
          cart.close(cb);
        }
      }
    ],
      function(err, cart) {
        publish(me, events.DELETE, cart);
        if (target) { publish(me, events.UPDATE, target); }
        if (err) { sendError(res, err); }
        res.json(cart);
      });
  }
};
