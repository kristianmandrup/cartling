// scopes to logged in user as appropriate - based on url
export default function findCart*(req, cartId) {
  if (req.url.indexOf('/my/') > 0) {
    var me = req.user;
    yield me.findCart(cartId);
  } else {
    yield Cart.findOne(cartId);
  }
}
