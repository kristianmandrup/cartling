'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
var storeApp = angular.module('PhrixusStore', ['ngRoute', 'phrixus'])

storeApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/store', {
      templateUrl: 'partials/store.html',
      controller: storeController
    }).
    when('/products/:productSku', {
      templateUrl: 'partials/product.html',
      controller: storeController
    }).
    when('/cart', {
      templateUrl: 'partials/shoppingCart.html',
      controller: storeController
    }).
    otherwise({
      redirectTo: '/store'
    });
}]);

// create a data service that provides the entities that will be shared
// by all views instead of creating fresh ones for each view.
storeApp.factory("DataService", function(Phrixus) {

  var user = new User(Phrixus);

  // create store
  var store = new Store();

  // create shopping cart
  var cart = new ShoppingCart("PhrixusStore", user, Phrixus);

  // enable PayPal checkout
  // note: the second parameter identifies the merchant; in order to use the
  // shopping cart with PayPal, you have to create a merchant account with
  // PayPal. You can do that here:
  // https://www.paypal.com/webapps/mpp/merchant
  cart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");

  // enable Stripe checkout
  // note: the second parameter identifies your publishable key; in order to use the
  // shopping cart with Stripe, you have to create a merchant account with
  // Stripe. You can do that here:
  // https://manage.stripe.com/register
  cart.addCheckoutParameters("Stripe", "pk_test_xxxx", {
      chargeurl: "https://localhost:1234/processStripe.aspx"
    }
  );

  // return data object with store and cart
  return {
    store: store,
    cart: cart,
    user: user
  };
});

// add some handy stuff to $rootScope
storeApp.run(function($rootScope, $routeParams) {

  /**
   * Easy access to route params
   * REMEMBER: this object is empty until the $routeChangeSuccess event is broadcast
   */
  $rootScope.params = $routeParams;
  /**
   * Wrapper for angular.isArray, isObject, etc checks for use in the view
   *
   * @param type {string} the name of the check (casing sensitive)
   * @param value {string} value to check
   */
  $rootScope.is = function(type, value) {
    return angular['is'+type](value);
  };
  /**
   * Wrapper for $.isEmptyObject()
   *
   * @param value	{mixed} Value to be tested
   * @return boolean
   */
  $rootScope.empty = function(value) {
    return $.isEmptyObject(value);
  };
  /**
   * Debugging Tools
   *
   * Allows you to execute debug functions from the view
   */
  $rootScope.log = function(variable) {
    console.log(variable);
  };
  $rootScope.alert = function(text) {
    alert(text);
  };
});

