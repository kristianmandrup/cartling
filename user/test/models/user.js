'use strict';

var should = require('should');
var _ = require('lodash');
var helpers = require('../helpers');
var User = helpers.User;
var async = require('async');

describe('User Model', function() {

  this.timeout(10000);
  var TEST_TRUE = { test: true };
  var users;

  before(function(done) {
    User.deleteAll(TEST_TRUE, done);
  });

  after(function(done) {
    User.deleteAll(TEST_TRUE, done);
  });

  it('can reap old guests', function(done) {
    var usernames = ['dopey', 'sleepy', 'grumpy'];
    var times = [];
    async.eachSeries(usernames,
      function(username, cb) {
        var attrs = { username: username, test: true };
        if (username !== 'sleepy') { attrs.guest = true; }
        User.create(attrs, function (err, reply) {
          if (err) { cb(err); }
          times.push(reply.modified);
          cb();
        });
      },
      function (err) {
        should.not.exist(err);
        User.findBy(TEST_TRUE, function (err, reply) {
          should.not.exist(err);
          reply.length.should.equal(3);
          var age = new Date().getTime() - times[1];
          User.reapGuests(age, function (err, reply) {
            should.not.exist(err);
            reply.should.equal(1);

            User.reapGuests(0, function (err, reply) {
              should.not.exist(err);
              reply.should.equal(1);

              User.find('sleepy', function (err, reply) {
                should.not.exist(err);
                should.exist(reply);
                reply.username.should.equal('sleepy');
                done();
              });
            });
          });
        });
      }
    );
  });

});

