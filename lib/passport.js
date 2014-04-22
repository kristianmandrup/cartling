'use strict';

var config = require('../config');
var common = require('../common')(config);
var passport = require('passport');
var User = common.usergrid.User;
var _ = require('lodash');

exports.initialize = function() {
  return passport.initialize();
};

exports.authenticate = function(strategy, options, callback) {
  return passport.authenticate(strategy, options, callback);
};

passport.serializeUser(function(user, done) {
  done(null, user.get('uuid'));
});

passport.deserializeUser(function(uuid, done) {
  User.find(uuid, function (err, user) {
    done(err, user);
  });
});


// todo: test this
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({ usernameField: 'username' }, function(username, password, done) {
  User.getAccessToken(username, password, function(err, ok) {
    if (err) {
      return done(null, false, { message: 'Invalid username or password.' });
    } else {
      User.find(username, function(err, user) {
        return done(null, user);
      });
    }
  });
}));


// volos
// todo: not done
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var creds = config.registration.app;
passport.use('volos', new OAuth2Strategy({
    authorizationURL: '/volos/authorize',
    tokenURL: '/volos/access_token',
    clientID: creds.key,
    clientSecret: creds.secret,
    callbackURL: '/auth/volos/callback',
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    User.find(req.user.get('uuid'), function(err, user) {
//      user.save(function(err) {
        done(err, user);
//      });
    });
  }
));


var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy(config.passport.facebook,
  function (req, accessToken, refreshToken, profile, done) {
    if (req.user) { // logged in
      // associate profile w/ user
      var attrs = facebookAttributes(profile);
      req.user.update(attrs, function(err) {
        done(err, req.user);
      });
    } else { // not logged in
      // find and associate w/ a user
      User.first({ 'facebook.id': profile.id }, function(err, existingUser) {
        if (existingUser) { return done(null, existingUser); }
        // no existing user, create one
        var attrs = facebookAttributes(profile);
        User.create(attrs, function(err, user) {
          done(err, user);
        });
      });
    }
  }
));

// todo: only update new attributes
function facebookAttributes(profile) {
  var attrs = {};
  attrs.username = profile._json.email;
  attrs.email = profile._json.email;
  attrs.name = profile.displayName;
  attrs.picture = profile._json.profile_image_url;
  attrs.facebook = profile._json;
  return attrs;
}


//var TwitterStrategy = require('passport-twitter').Strategy;
//passport.use(new TwitterStrategy(config.passport.twitter,
//  function (req, accessToken, refreshToken, profile, done) {
//    if (req.user) { // logged in
//      // associate profile w/ user
//      var attrs = twitterAttributes(profile);
//      req.user.update(attrs, function(err) {
//        done(err, req.user);
//      });
//    } else { // not logged in
//      // find and associate w/ a user
//      User.first({ 'twitter.id': profile.id }, function(err, existingUser) {
//        if (existingUser) { return done(null, existingUser); }
//        // no existing user, create one
//        var attrs = twitterAttributes(profile);
//        User.create(attrs, function(err, user) {
//          done(err, user);
//        });
//      });
//    }
//  }
//));
//
//// todo: only update new attributes
//function twitterAttributes(profile) {
//  var attrs = {};
//  attrs.username = profile.displayName;
//  attrs.email = profile.displayName;
//  attrs.name = profile.displayName;
//  attrs.picture = profile._json.profile_image_url;
//  attrs.twitter = profile._json;
//  return attrs;
//}



var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy(config.passport.google,
  function (req, accessToken, refreshToken, profile, done) {
    if (req.user) { // logged in
      // associate profile w/ user
      var attrs = googleAttributes(profile);
      req.user.update(attrs, function(err) {
        done(err, req.user);
      });
    } else { // not logged in
      // find and associate w/ a user
      User.first({ 'google.id': profile.id }, function(err, existingUser) {
        if (existingUser) { return done(null, existingUser); }
        // no existing user, create one
        var attrs = googleAttributes(profile);
        User.create(attrs, function(err, user) {
          done(err, user);
        });
      });
    }
  }
));

// todo: only update new attributes
function googleAttributes(profile) {
  var attrs = {};
  attrs.username = profile._json.email;
  attrs.email = profile._json.email;
  attrs.name = profile.displayName;
  attrs.picture = profile._json.picture;
  attrs.google = profile._json;
  return attrs;
}


//var GitHubStrategy = require('passport-github').Strategy;
//passport.use(new GitHubStrategy(config.github, function(req, accessToken, refreshToken, profile, done) {
//  if (req.user) {
//    User.findById(req.user.id, function(err, user) {
//      user.github = profile.id;
//      user.tokens.push({ kind: 'github', accessToken: accessToken });
//      user.profile.name = user.profile.name || profile.displayName;
//      user.profile.picture = user.profile.picture || profile._json.avatar_url;
//      user.profile.location = user.profile.location || profile._json.location;
//      user.profile.website = user.profile.website || profile._json.blog;
//      user.save(function(err) {
//        done(err, user);
//      });
//    });
//  } else {
//    User.findOne({ github: profile.id }, function(err, existingUser) {
//      if (existingUser) return done(null, existingUser);
//      var user = new User();
//      user.email = profile._json.email;
//      user.github = profile.id;
//      user.tokens.push({ kind: 'github', accessToken: accessToken });
//      user.profile.name = profile.displayName;
//      user.profile.picture = profile._json.avatar_url;
//      user.profile.location = profile._json.location;
//      user.profile.website = profile._json.blog;
//      user.save(function(err) {
//        done(err, user);
//      });
//    });
//  }
//}));

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  if (_.find(req.user.tokens, { kind: provider })) { return next(); }
  res.redirect('/auth/' + provider);
};
