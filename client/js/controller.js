'use strict';

// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $routeParams, DataService) {

  // get store and cart from service
  $scope.store = DataService.store;
  $scope.cart = DataService.cart;

  // use routing to pick the selected product
  if ($routeParams.productSku != null) {
      $scope.product = $scope.store.getProduct($routeParams.productSku);
  }

  $scope.user = DataService.user;
}

function userController($scope, DataService, config) {

  $scope.user = DataService.user;

  function closeLoginDialog() {
    $('#loginDialog').modal('hide');
  }

  $scope.login = function() {

    // todo: add a spinner to the dialog
    var promise = $scope.user.login();
    promise.then(
      function(success) {
        console.log(success);
        closeLoginDialog();
      },
      function(failure) {
        console.log(failure);
        // todo: put the error on the dialog instead
        alert('Login failed: ' + (failure.data.message || failure.data.error_description));
      }
    );
  };

  $scope.oauthLogin = function(provider) {

    $scope.oauthCallback = function(e) {
      if (e.origin !== config.base) { return; }
      var params = e.data;
      if (params.username) {
        console.log('username: ' + params.username);
        console.log('accessToken: ' + params.accessToken);
        $scope.user.setUsername(params.username);
        $scope.user.setAccessToken(params.accessToken);
        $scope.$apply();
        closeLoginDialog();
      }
    };

    var url = config.base + '/auth/' + provider;
    var width = 1020;
    var height = 600;
    var left = (screen.availWidth/2)-(width/2);
    var top = (screen.availHeight/2)-(height/2);
    window.addEventListener("message", $scope.oauthCallback, false);
    window.open(url, "SignIn", "left="+left+",top="+top+",width="+width+",height="+height+",toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0");
  };

  $scope.logout = function() {
    $scope.user.logout();
  };
}

function oauthCallbackController($location, config) {

  var queryString = {};
  $location.absUrl().replace(
    new RegExp("([^?=&]+)=(([^&#]*))?", "g"),
    function($0, $1, $2, $3) { queryString[decodeURIComponent($1)] = decodeURIComponent($3); }
  );

  window.opener.postMessage(queryString, config.base);
  window.close();
}
