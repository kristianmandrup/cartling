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
  var cartApp = require('../')(config);
  cartApp.routes(app, mockOAuthMiddleware);

  // start //
  app.listen(app.get('port'));
  return app;
};


var mockOAuthMiddleware = {
  authenticate: function() {
    return function(req, resp, next) {
      req.token = {};
      req.token.attributes = {};
      req.token.attributes.username = 'testuser';
      return next();
    };
  }
};
