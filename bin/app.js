#!/usr/local/bin/node

'use strict';

var _ = require('lodash');
var express = require('express');
var app = express();
var config = require('../config');

app.use(express.logger());
app.use(express.compress());
app.use(express.json());


// apply app config //

_.each(config.app, function(v,k) { app.set(k,v); });


// OAuth //

var oauthConfig = config.oauth.config || {};
oauthConfig.validGrantTypes = [ 'client_credentials', 'authorization_code', 'implicit_grant', 'password' ];
oauthConfig.passwordCheck = checkPassword;
oauthConfig.beforeCreateToken = beforeCreateToken;
var oauth = config.oauth.provider.create(oauthConfig).expressMiddleware();


// routes //

app.get('/authorize', oauth.handleAuthorize());
app.post('/accesstoken', oauth.handleAccessToken());
app.post('/invalidate', oauth.invalidateToken());
app.post('/refresh', oauth.refreshToken());
//app.use(oauth.authenticate());


var cart = require('../cart')(config);
cart.routes(app, oauth);

var user = require('../user')(config);
user.routes(app, oauth);


// start express //
app.listen(app.get('port'), function() {
  printInstructions();
});
module.exports = app;


// store the username with the token
function beforeCreateToken(parsedBody, options, next) {
  if (parsedBody.grant_type === 'password') {
    var attributes = { username: parsedBody.username };
    options.attributes = attributes;
  }
  next();
}

// use Usergrid as the user store and let it check the passwords
function checkPassword(username, password, cb) {
  user.User.getAccessToken(username, password, cb);
}

function printInstructions() {
  var creds = config.registration.app;
  var defaultUser = config.registration.defaultUser;

  checkPassword(defaultUser.username, defaultUser.password, function(err, reply) {
    console.log();
    console.log('All ready!');
    console.log("Express listening on port %d in %s mode", app.get('port'), app.settings.env);
    console.log();
    console.log('This command will get you a token for cart and user scopes for the default user:');
    console.log();
    console.log('curl -X POST "http://localhost:%d/accesstoken" -d ' +
      '"grant_type=password&client_id=%s&client_secret=%s&scope=user%20cart&username=%s&password=%s"\n',
      app.get('port'), encodeURIComponent(creds.key), encodeURIComponent(creds.secret), defaultUser.username,
      defaultUser.password);

    console.log('Or use a token I got for you. Just start your curl commands like so:');
    console.log();
    console.log('curl -H "Authorization: Bearer mbldJpWesj145+yoYEd4l7IZirZz7XR2IQuUJlJeNLs=" "http://localhost:%d/...',
      app.get('port'));
  });
}
