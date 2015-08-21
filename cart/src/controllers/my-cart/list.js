module.exports = function(req, res) {
  log.debug('my cart list');
  var me = req.user;
  var criteria = req.query || {};
  _.assign(criteria, OPEN_CRITERIA);
  me.findCartsBy(criteria, function(err, carts) {
    if (err) { sendError(res, err); }
    async.each(carts,
      function(cart, cb) {
        cart.fetchItems(cb);
      },
      function(err) {
        if (err) { sendError(res, err); }
        res.json(carts);
      }
    );
  });
}
