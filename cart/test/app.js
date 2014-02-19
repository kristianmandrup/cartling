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
  var cart = require('phrixus-cart')(config);
  cart.routes(app, mockOAuthMiddleware);

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
