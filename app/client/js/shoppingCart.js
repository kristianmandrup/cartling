'use strict';

//----------------------------------------------------------------
// shopping cart
//
function ShoppingCart(cartName, dataService, Phrixus) {
  this.cartName = cartName;
  this.clearCart = false;
  this.checkoutParameters = {};
  this.items = [];

  this.user = dataService.user;
  this.store = dataService.store;
  this.Phrixus = Phrixus;

  // load items from local storage when initializing
  this.loadItems();
}

ShoppingCart.prototype.loadItems = function () {
  if (this.user.isLoggedIn()) {
    this.loadItemsFromPhrixus();
  } else {
    this.loadLocalStorageItems();
  }
};

// load items from local storage
ShoppingCart.prototype.loadLocalStorageItems = function () {

  var items = localStorage !== null ? localStorage[this.cartName + "_items"] : null;
  if (items !== null && JSON !== null) {
    try {
      items = JSON.parse(items);
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var product = this.store.getProduct(items[i].sku);
        if (product) {
          item = new CartItem(item.sku, product.name, product.price, item.quantity);
          this.items.push(item);
        }
      }
    }
    catch (err) {
      // ignore errors while loading...
    }
  }
};

ShoppingCart.prototype.loadItemsFromPhrixus = function () {
  // todo: merge items w/ local?
  var self = this;
  if (this.user.isLoggedIn()) {
    var promise = this.Phrixus.Cart.query({cartName: this.cartName }).$promise;
    promise.then(
      function(success) {
        var cart = success[0];
        if (cart) {
          self.uuid = cart.uuid;
          for (var i = 0; i < cart.items.length; i++) {
            var item = cart.items[i];
            self.addItemNoSave(item.sku, item.itemName, item.price, item.quantity);
          }
          self.saveItems();
        }
      },
      function(failure) {
        console.log(failure);
        if (failure.data.error === 'invalid_grant') {
          if (self.user) { self.user.logout(); }
        }
        this.loadLocalStorageItems(); // fallback
      }
    );
  }
};

// save items to local storage & usergrid
ShoppingCart.prototype.saveItems = function() {

  if (localStorage && JSON) {
    localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
  }

  if (this.user.isLoggedIn() && this.items.length > 0) {
    var cart = new this.Phrixus.Cart({ cartName: this.cartName });
    cart.uuid = this.uuid;

    var serverItems = [];
    for (var i = 0; i < this.items.length; i++) {
      serverItems.push(new ServerItem(this.items[i]));
    }
    cart.items = serverItems;
    var promise = cart.$save();

    var self = this;
    promise.then(

      function(success) {
        self.uuid = success.uuid;
      },

      function(failure) {
        console.log(failure);
      }
    );
  }
};

// adds an item to the cart
ShoppingCart.prototype.addItem = function (sku, name, price, quantity) {
  this.addItemNoSave(sku, name, price, quantity);
  this.saveItems();
};

// adds an item to the cart
ShoppingCart.prototype.addItemNoSave = function (sku, name, price, quantity) {
  quantity = this.toNumber(quantity);
  if (quantity !== 0) {

    // update quantity for existing item
    var found = false;
    for (var i = 0; i < this.items.length && !found; i++) {
      var item = this.items[i];
      if (item.sku === sku) {
        found = true;
        item.quantity = this.toNumber(item.quantity + quantity);
        if (item.quantity <= 0) {
          this.items.splice(i, 1);
        }
      }
    }

    // new item, add now
    if (!found) {
      var item = new CartItem(sku, name, price, quantity);
      this.items.push(item);
    }
  }
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalPrice = function (sku) {
  var total = 0;
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    if (!sku || item.sku === sku) {
      total += this.toNumber(item.quantity * item.price);
    }
  }
  return total;
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalCount = function (sku) {
  var count = 0;
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    if (!sku || item.sku === sku) {
      count += this.toNumber(item.quantity);
    }
  }
  return count;
};

// clear the cart
ShoppingCart.prototype.clearItems = function () {
  this.items = [];
  this.saveItems();
};

// define checkout parameters
ShoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

  // check parameters
  if (serviceName !== "PayPal" && serviceName !== "Google" && serviceName !== "Stripe") {
    throw "serviceName must be 'PayPal' or 'Google' or 'Stripe'.";
  }
  if (!merchantID) {
    throw "A merchantID is required in order to checkout.";
  }

  // save parameters
  this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
};

// check out
ShoppingCart.prototype.checkout = function (serviceName, clearCart) {

  // select serviceName if we have to
  if (!serviceName) {
    var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
    serviceName = p.serviceName;
  }

  // sanity
  if (!serviceName) {
    throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
  }

  // go to work
  var parms = this.checkoutParameters[serviceName];
  if (!parms) {
    throw "Cannot get checkout parameters for '" + serviceName + "'.";
  }
  switch (parms.serviceName) {
    case "PayPal":
      this.checkoutPayPal(parms, clearCart);
      break;
    case "Google":
      this.checkoutGoogle(parms, clearCart);
      break;
    case "Stripe":
      this.checkoutStripe(parms, clearCart);
      break;
    default:
      throw "Unknown checkout service: " + parms.serviceName;
  }
};

// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
ShoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

  // global data
  var data = {
    cmd: "_cart",
    business: parms.merchantID,
    upload: "1",
    rm: "2",
    charset: "utf-8"
  };

  // item data
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var ctr = i + 1;
    data["item_number_" + ctr] = item.sku;
    data["item_name_" + ctr] = item.name;
    data["quantity_" + ctr] = item.quantity;
    data["amount_" + ctr] = item.price.toFixed(2);
  }

  // build form
  var form = $('<form/></form>');
  form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
  form.attr("method", "POST");
  form.attr("style", "display:none;");
  this.addFormFields(form, data);
  this.addFormFields(form, parms.options);
  $("body").append(form);

  // submit form
  this.clearCart = clearCart == null || clearCart;
  form.submit();
  form.remove();
};

// check out using Stripe
// for details see:
// https://stripe.com/docs/checkout
ShoppingCart.prototype.checkoutStripe = function (parms, clearCart) {

  // global data
  var data = {};

  // item data
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var ctr = i + 1;
    data["item_name_" + ctr] = item.sku;
    data["item_description_" + ctr] = item.name;
    data["item_price_" + ctr] = item.price.toFixed(2);
    data["item_quantity_" + ctr] = item.quantity;
  }

  // build form
  var form = $('.form-stripe');
  form.empty();
  // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.
  // See https://stripe.com/docs/checkout
  // You'll get a POST to the address below w/ a stripeToken.
  // First, you have to initialize the Stripe API w/ your public/private keys.
  // You then call Customer.create() w/ the stripeToken and your email address.
  // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.
  form.attr("action", parms.options['chargeurl']);
  form.attr("method", "POST");
  form.attr("style", "display:none;");
  this.addFormFields(form, data);
  this.addFormFields(form, parms.options);
  $("body").append(form);

  // ajaxify form
  form.ajaxForm({
    success: function () {
      $.unblockUI();
      alert('Thanks for your order!');
    },
    error: function (result) {
      $.unblockUI();
      alert('Error submitting order: ' + result.statusText);
    }
  });

  var token = function (res) {
    var $input = $('<input type=hidden name=stripeToken />').val(res.id);

    // show processing message and block UI until form is submitted and returns
    $.blockUI({ message: 'Processing order...' });

    // submit form
    form.append($input).submit();
    this.clearCart = clearCart == null || clearCart;
    form.submit();
  };

  StripeCheckout.open({
    key: parms.merchantID,
    address: false,
    amount: this.getTotalPrice() * 100, /** expects an integer **/
    currency: 'usd',
    name: 'Purchase',
    description: 'Description',
    panelLabel: 'Checkout',
    token: token
  });
};

// utility methods
ShoppingCart.prototype.addFormFields = function (form, data) {
  if (data != null) {
    $.each(data, function (name, value) {
      if (value != null) {
        var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
        form.append(input);
      }
    });
  }
};

ShoppingCart.prototype.toNumber = function (value) {
  value = value * 1;
  return isNaN(value) ? 0 : value;
};

//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
//
function checkoutParameters(serviceName, merchantID, options) {
  this.serviceName = serviceName;
  this.merchantID = merchantID;
  this.options = options;
}

//----------------------------------------------------------------
// items in the cart
//
function CartItem(sku, name, price, quantity) {
  this.sku = sku;
  this.name = name;
  this.price = price * 1;
  this.quantity = quantity * 1;
}


function ServerItem(cartItem) {
  this.sku = cartItem.sku;
  this.itemName = cartItem.name;
  this.price = cartItem.price;
  this.quantity = cartItem.quantity;
}

