'use strict';

var should = require('should');
var request = require('supertest');
var _ = require('lodash');
var async = require('async');

var helpers = require('../helpers');
var models = helpers.models;
var Cart = models.Cart;
var User = models.User;
var intents = helpers.common.intents;

var server = require('../app')(helpers.config);

describe('API', function() {

  describe('cart', function() {

    this.timeout(10000);

    var cartAttributes = [
      { foo: 'foo' },
      { foo: 'bar', bar: 'baz' }
    ];
    var carts = [];

    before(function(done) {
      Cart.deleteAll(function(err) {
        async.each(cartAttributes,
          function(attrs, cb) {
            Cart.create(attrs, function (err, reply) {
              should.not.exist(err);
              carts.push(reply);
              cb();
            });
          },
          done);
      });
    });

    after(function(done) {
      Cart.deleteAll(function(err) {
        done();
      });
    });

    it('list all', function(done) {
      request(server)
        .get('/carts')
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(200);
          var entities = res.body;
          entities.should.be.an.Array;
          entities.length.should.be.greaterThan(2);
          done();
        });
    });

    it('can query', function(done) {
      request(server)
        .get('/carts')
        .query('q=uuid=' + carts[1].get('uuid'))
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(200);
          var entities = res.body;
          entities.should.be.an.Array;
          entities.length.should.equal(1);
          var cart = entities[0];
          cart.uuid.should.equal(carts[1].get('uuid'));
          done();
        });
    });

    it('can create', function(done) {
      var attrs = { foo: 'skippy' };
      request(server)
        .post('/carts')
        .send(attrs)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(200);
          var cart = res.body;
          cart.uuid.should.not.be.null;
          carts.push(cart);
          cart.foo.should.equal('skippy');
          done();
        });
    });

    it('can intercept and abort create', function(done) {
      var attrs = { foo: 'skippy' };
      intents.before('create', 'cart', function(intent, done) {
        should.not.exist(intent.subject);
        intent.op.should.equal('create');
        intent.target.should.equal('cart');
        should.deepEqual(intent.data, attrs);
        var err = new Error('no way, forget it');
        err.statusCode = 401;
        done(err);
      });
      request(server)
        .post('/carts')
        .send(attrs)
        .end(function(err, res) {
          intents.clearAll();
          should.not.exist(err);
          res.status.should.eql(401);
          done();
        });
    });

    it('can update from uuid', function(done) {
      var body = { bar: 'babs' };
      request(server)
        .put('/carts/' + carts[1].get('uuid'))
        .send(body)
        .end(function(err, res) {
          if (err) { return done(err); }
          res.status.should.eql(200);
          var cart = res.body;
          cart.bar.should.equal('babs');
          done();
        });
    });

    it('can intercept and abort update', function(done) {
      var body = { bar: 'babs' };
      intents.before('update', 'cart', function(intent, done) {
        should.not.exist(intent.subject);
        intent.op.should.equal('update');
        intent.target.should.equal('cart');
        should.deepEqual(intent.data, body);
        var err = new Error('no way, forget it');
        err.statusCode = 501;
        done(err);
      });
      request(server)
        .put('/carts/' + carts[1].get('uuid'))
        .send(body)
        .end(function(err, res) {
          intents.clearAll();
          if (err) { return done(err); }
          res.status.should.eql(501);
          done();
        });
    });

    it('can intercept and abort closing the cart', function(done) {
      var uuid = carts[1].get('uuid');
      intents.before('delete', 'cart', function(intent, done) {
        should.not.exist(intent.subject);
        intent.op.should.equal('delete');
        intent.target.get('uuid').should.equal(uuid);
        var err = new Error('no way, forget it');
        err.statusCode = 301;
        done(err);
      });
      request(server)
        .del('/carts/' + uuid)
        .end(function(err, res) {
          intents.clearAll();
          res.status.should.eql(301);
          done();
        });
    });

    it('can close the cart', function(done) {
      var uuid = carts[1].get('uuid');
      request(server)
        .del('/carts/' + uuid)
        .end(function(err, res) {
          res.status.should.eql(200);

          // should still be visible here
          request(server)
            .get('/carts/' + uuid)
            .end(function(err, res) {
              if (err) { return done(err); }
              res.status.should.eql(200);
              var cart = res.body;
              cart.status.should.equal('closed');
              done();
            });
        });
    });

  });
});