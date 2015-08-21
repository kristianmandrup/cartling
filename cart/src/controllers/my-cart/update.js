module.exports = function(req, res) {
  var id = req.params.id;
  if (!id) { return res.json(400, 'missing id'); }
  var attributes = req.body;
  log.debug('%s update %j', type, req.body);
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
      verify(me, events.UPDATE, cart, attributes, function(err) {
        cb(err, cart);
      });
    },
    function(cart, cb) {
      cart.update(attributes, cb);
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      log.debug('%s updated %s', type, id);
      publish(me, events.UPDATE, cart, attributes);
      res.json(cart);
  });
}
