'use strict';

var config = require('../common');
var passport = require('passport');
var User = require('usergrid/user');
var config = require('../common');
var _ = require('lodash');

// proxied methods - used by app for setup
exports.initialize = function() {
  return passport.initialize();
};

exports.authenticate = function() {
  return passport.authenticate(arguments);
};

exports.session = function() {
  return passport.session();
};


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.findById(id, function (err, user) {
    done(err, user);
  });
});


var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  user.findOne({ email: email }, function(err, user) {
    if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      }
    });
  });
}));

var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy(config.facebook, function (req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    user.findById(req.user.id, function(err, user) {
      user.facebook = profile.id;
      user.tokens.push({ kind: 'facebook', accessToken: accessToken });
      user.profile.name = user.profile.name || profile.displayName;
      user.profile.gender = user.profile.gender || profile._json.gender;
      user.profile.picture = user.profile.picture || profile._json.profile_image_url;
      user.save(function(err) {
        done(err, user);
      });
    });
  } else {
    user.findOne({ facebook: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      var user = new user();
      user.email = profile._json.email;
      user.facebook = profile.id;
      user.tokens.push({ kind: 'facebook', accessToken: accessToken });
      user.profile.name = profile.displayName;
      user.profile.gender = profile._json.gender;
      user.profile.picture = profile._json.profile_image_url;
      user.save(function(err) {
        done(err, user);
      });
    });
  }
}));

var TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy(config.twitter, function(req, accessToken, tokenSecret, profile, done) {
  if (req.user) {
    user.findById(req.user.id, function(err, user) {
      user.twitter = profile.id;
      user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });
      user.profile.name = user.profile.name || profile.displayName;
      user.profile.location = user.profile.location || profile._json.location;
      user.profile.picture = user.profile.picture || profile._json.profile_image_url;
      user.save(function(err) {
        done(err, user);
      });
    });
  } else {
    user.findOne({ twitter: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      var user = new user();
      user.email = profile.displayName;
      user.twitter = profile.id;
      user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });
      user.profile.name = profile.displayName;
      user.profile.location = profile._json.location;
      user.profile.picture = profile._json.profile_image_url;
      user.save(function(err) {
        done(err, user);
      });
    });
  }
}));

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy(config.google, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    user.findById(req.user.id, function(err, user) {
      user.google = profile.id;
      user.tokens.push({ kind: 'google', accessToken: accessToken });
      user.profile.name = user.profile.name || profile.displayName;
      user.profile.gender = user.profile.gender || profile._json.gender;
      user.profile.picture = user.profile.picture || profile._json.picture;
      user.save(function(err) {
        done(err, user);
      });
    });
  } else {
    user.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      var user = new user();
      user.email = profile._json.email;
      user.google = profile.id;
      user.tokens.push({ kind: 'google', accessToken: accessToken });
      user.profile.name = profile.displayName;
      user.profile.gender = profile._json.gender;
      user.profile.picture = profile._json.picture;
      user.save(function(err) {
        done(err, user);
      });
    });
  }
}));

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
//
//var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//passport.use('foursquare', new OAuth2Strategy({
//    authorizationURL: 'https://foursquare.com/oauth2/authorize',
//    tokenURL: 'https://foursquare.com/oauth2/access_token',
//    clientID: config.foursquare.clientId,
//    clientSecret: config.foursquare.clientSecret,
//    callbackURL: config.foursquare.redirectUrl,
//    passReqToCallback: true
//  },
//  function (req, accessToken, refreshToken, profile, done) {
//    User.findById(req.user._id, function(err, user) {
//      user.tokens.push({ kind: 'foursquare', accessToken: accessToken });
//      user.save(function(err) {
//        done(err, user);
//      });
//    });
//  }
//));

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  if (_.findWhere(req.user.tokens, { kind: provider })) next();
  else res.redirect('/auth/' + provider);
};