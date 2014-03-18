'use strict';

function User(Phrixus) {
  this.Phrixus = Phrixus;
}

User.prototype.setUsername = function(username) {
  this.username = username;
};

User.prototype.setPassword = function(password) {
  this.password = password;
};

User.prototype.setAccessToken = function(accessToken) {
  this.accessToken = accessToken;
  this.Phrixus.setAccessTokenHeader(accessToken);
};

User.prototype.login = function() {

  var promise = this.Phrixus.login(this.username, this.password);
  var self = this;
  return promise.then(
    function(success) {
      var accessToken = success.data.access_token;
      self.setAccessToken(accessToken);
    },

    function(failure) {
      self.setAccessToken(null);
      throw failure;
    }
  );
};

User.prototype.logout = function() {
  this.setAccessToken(null);
};

User.prototype.isLoggedIn = function() {
  return !!this.accessToken;
};
