module.exports = function(req, res) {
  var id = req.params.id;
  if (!id) { return res.json(400, 'missing id'); }
  var criteria = { _id: id };
  _.assign(criteria, OPEN_CRITERIA);
  var me = req.user;
  async.waterfall([
    function(cb) {
      me.findCartsBy(criteria, 1, cb);
    },
    function(carts, cb) {
      if (carts.length === 0) { return cb(make404()); }
      cb(null, carts[0]);
    },
    function(cart, cb) {
      cart.fetchItems(cb);
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      log.debug('%s found %s', type, id);
      res.json(cart);
  });
}
