'use strict';

module.exports = addUserContext;

function addUserContext(req, res, next) {
  var User = require('./user');
  var username = req.token.attributes.username;
  req.user = User.new({ username: username });
  next();
}
