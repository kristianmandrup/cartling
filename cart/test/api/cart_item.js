'use strict';

var should = require('should');
var request = require('supertest');
var _ = require('lodash');
var async = require('async');

var helpers = require('../helpers');
var models = helpers.models;
var Cart = models.Cart;
var CartItem = models.CartItem;
var ActivityLog = models.ActivityLog;
var intents = helpers.common.intents;

var server = require('../app')(helpers.config);

describe('API', function() {

  describe('cart item', function() {

    this.timeout(10000);
    var CART_ATTRS = { test: true, sku: 123 };
    var cart;
    var cartItem;
    var cartUUID;

    before(function(done) {
      async.parallel([
        ActivityLog.deleteAll.bind(ActivityLog),
        CartItem.deleteAll.bind(CartItem),
        Cart.deleteAll.bind(Cart)
      ],
        function(cb) {
          Cart.create(CART_ATTRS, function (err, entity) {
            if (err) { return done(err); }
            cart = entity;
            cartUUID = entity.get('uuid');
            done();
          });
        }
      );
    });

    after(function(done) {
      async.parallel([
        ActivityLog.deleteAll.bind(ActivityLog),
        CartItem.deleteAll.bind(CartItem),
        Cart.deleteAll.bind(Cart)
      ],
        done);
    });

    afterEach(function(done) {
      intents.clearAll();
      done();
    });

    it('can add an item', function(done) {
      request(server)
        .post('/carts/' + cartUUID + '/items')
        .send(CART_ATTRS)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(200);
          cart = res.body;
          cart.items.should.be.an.Array;
          cart.items.length.should.equal(1);
          cartItem = cart.items[0];
          cartItem.test.should.equal(CART_ATTRS.test);
          done();
        });
    });

    it('get cart includes items', function(done) {
      request(server)
        .get('/carts/' + cartUUID)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(200);
          var cart = res.body;
          var items = cart.items;
          items.length.should.equal(1);
          should.exist(items[0].uuid);
          done();
        });
    });

    it('can update an item', function(done) {
      request(server)
        .put('/carts/' + cartUUID + '/items/' + cartItem.uuid)
        .send({ quantity: 42 })
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(200);
          var cart = res.body;
          var items = cart.items;
          items.length.should.equal(1);
          items[0].quantity.should.equal(42);
          done();
        });
    });

    it('can intercept and abort adding an item', function(done) {
      intents.before('create', 'cartitem', function(intent, done) {
        should.not.exist(intent.subject);
        intent.op.should.equal('create');
        intent.target.get('type').should.equal('cartitem');
        intent.target.get('sku').should.equal(CART_ATTRS.sku);
        var err = new Error('no way, forget it');
        err.statusCode = 401;
        done(err);
      });
      request(server)
        .post('/carts/' + cartUUID + '/items')
        .send(CART_ATTRS)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(401);
          done();
        });
    });

    it('can intercept and abort updating an item', function(done) {
      intents.before('update', 'cartitem', function(intent, done) {
        should.not.exist(intent.subject);
        intent.op.should.equal('update');
        intent.target.get('type').should.equal('cartitem');
        intent.target.get('sku').should.equal(CART_ATTRS.sku);
        var err = new Error('no way, forget it');
        err.statusCode = 401;
        done(err);
      });
      request(server)
        .put('/carts/' + cartUUID + '/items/' + cartItem.uuid)
        .send({ quantity: 42 })
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(401);
          done();
        });
    });

    it('can intercept and abort deleting an item', function(done) {
      intents.before('delete', 'cartitem', function(intent, done) {
        should.not.exist(intent.subject);
        intent.op.should.equal('delete');
        intent.target.get('type').should.equal('cartitem');
        intent.target.get('uuid').should.equal(cartItem.uuid);
        var err = new Error('no way, forget it');
        err.statusCode = 401;
        done(err);
      });
      request(server)
        .del('/carts/' + cartUUID + '/items/' + cartItem.uuid)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(401);
          done();
        });
    });

    it('can delete an item', function(done) {
      request(server)
        .del('/carts/' + cartUUID + '/items/' + cartItem.uuid)
        .end(function(err, res) {
          should.not.exist(err);
          res.status.should.eql(200);
          var cart = res.body;
          var items = cart.items;
          items.length.should.equal(0);
          done();
        });
    });
  });
});
