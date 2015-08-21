module.exports = function(req, res) {
  var id = req.params.id;
  if (!id) { return res.json(400, 'missing id'); }
  log.debug('%s close %s', type, id);
  var criteria = { _id: id };
  _.assign(criteria, OPEN_CRITERIA);
  var me = req.user;
  async.waterfall([
    function(cb) {
      me.findCartsBy(criteria, 1, cb);
    },
    function(carts, cb) {
      if (carts.length === 0) { return cb(make404()); }
      var cart = carts[0];
      log.debug('%s found %s', type, id);
      verify(me, events.DELETE, cart, null, function(err) {
        cb(err, cart);
      });
    },
    function(cart, cb) {
      cart.close(cb);
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      log.debug('%s closed %s', type, id);
      publish(me, events.DELETE, cart);
      res.json(cart);
  });
}
