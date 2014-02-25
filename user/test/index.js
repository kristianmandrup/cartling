'use strict';

var should = require('should');
var request = require('supertest');
var _ = require('lodash');
var async = require('async');
var helpers = require('./helpers');
var User = helpers.User;
var server = require('./app')(helpers.config);

describe('user app', function() {

  this.timeout(10000);
  var userAttributes = [{ username: 'foo', password: 'foo' },
                        { username: 'bar', password: 'bar' }];
  var users = [];

  before(function(done) {
    var oldUsernames = ['foo', 'bar', 'skippy'];
    async.each(oldUsernames,
      function(username, cb) {
        User.delete(username, cb);
      },
      function(err) {
        async.each(userAttributes,
          function(newUser, cb) {
            User.create(newUser, function(err, reply) {
              if (err) { return cb(err); }
              users.push(reply);
              cb();
            });
          },
          function (err) {
            done(err);
          });
      });
  });

  after(function(done) {
    async.each(users,
      function(user, cb) {
        user.delete(cb);
      },
      function(err) {
        done(err);
      });
  });

  describe('user', function() {

    it('list', function(done) {
      request(server)
        .get('/users')
        .end(function(err, res) {
          if (err) { return done(err); }
          res.status.should.eql(200);
          var entities = res.body;
          entities.should.be.an.Array;
          entities.length.should.equal(2);
          done();
        });
    });

    describe('create', function() {

      it('can succeed', function(done) {
        var attrs = { username: 'skippy' };
        request(server)
          .post('/users')
          .send(attrs)
          .end(function(err, res) {
            if (err) { return done(err); }
            res.status.should.eql(200);
            var user = res.body;
            user.uuid.should.not.be.null;
            user.username.should.equal('skippy');
            users.push(user);
            done();
          });
      });

    });

    describe('update', function() {

      it('can update using uuid', function(done) {
        var body = { bar: 'babs' };
        request(server)
          .put('/users/' + users[1].get('uuid'))
          .send(body)
          .end(function(err, res) {
            if (err) { return done(err); }
            res.status.should.eql(200);
            var cart = res.body;
            cart.bar.should.equal('babs');
            done();
          });
      });

    });

    describe('login', function() {

      it('can get a token with username/password', function(done) {
        var body = userAttributes[0];
        request(server)
          .post('/users/authenticate')
          .send(body)
          .end(function(err, res) {
            if (err) { return done(err); }
            res.status.should.eql(200);
            var reply = res.body;
            should.exist(reply.access_token);
            done();
          });
      });

    });
  });
});
