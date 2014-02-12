'use strict';

var _ = require('lodash');
var express = require('express');
var app = express();
var config = require('../config');
//var oauth = config.oauth.expressMiddleware();
var cart = require('./controllers/cart');

// apply config
_.forOwn(config.app, function(v,k) {
  app.set(k,v);
});

app.use(express.logger());
app.use(express.compress());
app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.multipart());

// routes //

//app.use(oauth.authenticate());

app.post('/cart',
//  oauth.authenticate('customer'),
  cart.create);

app.get('/cart',
//  oauth.authenticate('customer'),
  cart.list);

app.get('/cart/:id',
//  oauth.authenticate('customer'),
  cart.get);



// start //

app.listen(app.get('port'), function() {
  console.log("Express listening on port %d in %s mode", app.get('port'), app.settings.env);
});
module.exports = app;

