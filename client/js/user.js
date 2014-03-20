'use strict';

function User(Phrixus, DataService) {
  this.Phrixus = Phrixus;
  this.DataService = DataService;

  this.load();

  var self = this;
  $(window).unload(function () {
    self.save();
  });
}

User.prototype.save = function() {
  localStorage.user = JSON.stringify({ username: this.username, accessToken: this.accessToken });
};

User.prototype.load = function() {
  var user = localStorage ? localStorage.user : null;
  if (user) {
    try {
      user = JSON.parse(user);
      this.setUsername(user.username);
      this.setAccessToken(user.accessToken);
    } catch (err) {}
  }
};

User.prototype.setUsername = function(username) {
  this.username = username;
};

User.prototype.setPassword = function(password) {
  this.password = password;
};

User.prototype.setAccessToken = function(accessToken) {
  this.accessToken = accessToken;
  this.Phrixus.setAccessTokenHeader(accessToken);
  this.DataService.cart.loadItemsFromPhrixus();
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
  this.DataService.cart.clearItems();
};

User.prototype.isLoggedIn = function() {
  return !!this.accessToken;
};
