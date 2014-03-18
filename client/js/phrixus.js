'use strict';

var phrixus = angular.module('phrixus', ['ngResource']);
var baseUrl = 'http://localhost:3000/'; // todo: config

// Cart Resource
phrixus.factory('Phrixus', function ($resource, $http) {

  var Cart = $resource(
    baseUrl + 'my/carts/:id/'
  );

  var User = $resource(
    baseUrl + 'users/:id/:verb', {
      createGuest: {
        method: 'POST',
        params: { guest: true }
      }
    }
  );

  var login = function(username, password) {
    var url = baseUrl + 'login';
    var data = {
      username: username,
      password: password,
      scope: 'mycart'
    };
    return $http.post(url, data);
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
    login: login,
    setAccessTokenHeader: setAccessTokenHeader
  };
});
