
module.exports = function(req, res) {
  async.waterfall([
    function(cb) {
      commonController.get(req, res, cb);
    },
    function(cart, cb) {
      cart.fetchItems(cb);
    }
  ],
  function(err, cart) {
    if (err) { sendError(res, err); }
    res.json(cart);
  });
};
