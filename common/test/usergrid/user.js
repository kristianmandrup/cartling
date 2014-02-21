'use strict';

var should = require('should');
var _ = require('lodash');
var helpers = require('../helpers');
var User = helpers.User;

describe('User Model', function() {

  this.timeout(10000);
  var user_attrs = {
    username: 'testuser',
    password: 'password'
  };
  var user;

  before(function(done) {
    User.delete(user_attrs.username, function(err, reply) {
      User.create(user_attrs, function(err, reply) {
        if (err) { return done(err); }
        user = reply;
        done();
      });
    });
  });

  after(function(done) {
    if (user) {
      user.delete(function(err) {
        done();
      });
    }
  });

  describe('getAccessToken()', function() {

    it('should receive a token with a good username and password', function(done) {
      user.getAccessToken(user_attrs.password, function(err, reply) {
        should.not.exist(err);
        should.exist(reply.access_token);
        should.exist(reply.expires_in);
        done();
      });
    });

    it('should fail with a bad password', function(done) {
      user.getAccessToken('bad password', function(err, reply) {
        should.exist(err);
        err.name.should.equal('invalid_grant');
        should.not.exist(reply);
        done();
      });
    });

    it('class should receive a token with a good username and password', function(done) {
      User.getAccessToken(user_attrs.username, user_attrs.password, function(err, reply) {
        should.not.exist(err);
        should.exist(reply.access_token);
        should.exist(reply.expires_in);
        done();
      });
    });

    it('class should fail with a bad password', function(done) {
      User.getAccessToken(user_attrs.username, 'bad password', function(err, reply) {
        should.exist(err);
        err.name.should.equal('invalid_grant');
        should.not.exist(reply);
        done();
      });
    });

  });
});
