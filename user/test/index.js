'use strict';

var should = require('should');
var Url = require('url');
var request = require('supertest');
var querystring = require('querystring');
var _ = require('lodash');
var async = require('async');

var helpers = require('./helpers');
var User = helpers.User;

var server = require('./app')(helpers.config);

describe('user app', function() {

  this.timeout(5000);
  var users = [];

  before(function(done) {
    User.destroyAll(function(err, reply) {
      if (err) { return done(err); }
      async.parallel([
        function(cb) {
          User.create({ username: 'foo', password: 'foo' }, function(err, cart) {
            cb(err, cart);
          });
        },
        function(cb) {
          User.create({ username: 'bar', password: 'bar' }, function(err, cart) {
            cb(err, cart);
          });
        }
      ],
      function(err, results) {
        if (err) { return done(err); }
        users = results;
        done();
      });
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
            var user = JSON.parse(res.body);
            user.uuid.should.not.be.null;
            user.username.should.equal('skippy');
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
            var cart = JSON.parse(res.body);
            cart.bar.should.equal('babs');
            done();
          });
      });

    });

    describe('login', function() {

      it('can get a token with username/password', function(done) {
        var body = { bar: 'babs' };
        request(server)
          .put('/users/' + users[1].get('uuid'))
          .send(body)
          .end(function(err, res) {
            if (err) { return done(err); }
            res.status.should.eql(200);
            var cart = JSON.parse(res.body);
            cart.bar.should.equal('babs');
            done();
          });
      });

    });

  });
});
