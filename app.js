'use strict';

var _ = require('lodash');
var express = require('express');
var app = express();
var config = require('./config');
//var oauth = config.oauth.expressMiddleware();


var cart = require('./cart')(config);

// apply config
_.forOwn(config.app, function(v,k) {
  app.set(k,v);
});

app.use(express.logger());
app.use(express.compress());
app.use(express.json());
//app.use(oauth.authenticate());


//app.use(express.urlencoded());
//app.use(express.multipart());

// routes //

// todo: pass oauth roles/scopes
//cart.routes(app, oauth, scopes);
cart.routes(app);

// start //

app.listen(app.get('port'), function() {
  console.log("Express listening on port %d in %s mode", app.get('port'), app.settings.env);
});
module.exports = app;
