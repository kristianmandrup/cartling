'use strict';

var phrixus = angular.module('phrixus', ['ngResource']);

// Cart Resource
phrixus.factory('Phrixus', function ($resource, $http, config) {

  var baseUrl = config.base;

  var Cart = $resource(
    baseUrl + '/my/carts/:id'
  );

  // todo: utilize guest users
  var User = $resource(
    baseUrl + '/users/:id/:verb', {
      createGuest: {
        method: 'POST',
        params: { guest: true }
      }
    }
  );

  var Product = $resource(
      baseUrl + '/products/:id'
  );

  var login = function(username, password) {
    var url = baseUrl + '/login';
    var data = {
      username: username,
      password: password
    };
    return $http.post(url, data);
  };

  var getUserCart = function(cartName) {
    var url = baseUrl + '/my/carts?cartName=' + cartName;
    return $http.get(url);
  };

  // todo: is this the best way to deal with this?
  var setAccessTokenHeader = function(access_token) {
    if (access_token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
    } else {
      delete($http.defaults.headers.common.Authorization);
    }
  };

  return {
    Cart: Cart,
    User: User,
    Product: Product,
    login: login,
    getUserCart: getUserCart,
    setAccessTokenHeader: setAccessTokenHeader
  };
});
