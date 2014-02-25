'use strict';

var _ = require('lodash');
var express = require('express');
var app = express();

module.exports = function(config) {

  app.use(express.json());

  // apply config
  _.forOwn(config.app, function(v,k) {
    app.set(k,v);
  });

  // routes //
  var userApp = require('../')(config);
  userApp.routes(app, mockOAuthMiddleware);

  // test authenticate
  var user = require('../src/controllers/user');
  app.post('/users/authenticate', user.authenticate);

  // start //
  app.listen(app.get('port'));
  return app;
};


var mockOAuthMiddleware = {
  authenticate: function() {
    return function(req, resp, next) {
      return next();
    };
  }
};
