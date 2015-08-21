module.exports = function(req, res) {
  async.waterfall([
    function(cb) {
      commonController.create(req, res, cb);
    },
    function(cart, cb) {
      var me = req.user;
      me.addCart(cart, function(err) {
        cb(err, cart);
      });
    }
  ], function(err, cart) {
      if (err) { sendError(res, err); }
      res.json(cart);
  });
}
