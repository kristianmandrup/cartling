'use strict';

var should = require('should');
var Url = require('url');
var request = require('supertest');
var querystring = require('querystring');
var _ = require('lodash');
var server = require('../app');
var Cart = require('./helpers').models.Cart;
var CartItem = require('./helpers').models.CartItem;

describe('app', function() {

  this.timeout(5000);
  var carts = [];

  before(function(done) {
    Cart.create({ name: 'foo' }, function(err, cart) {
      if (err) { return done(err); }
      carts.push(cart);
      Cart.create({ name: 'bar', bar: 'baz' }, function(err, cart) {
        if (err) { return done(err); }
        carts.push(cart);
        done();
      });
    });
  });

  after(function(done) {
    deleteAllCarts(done);
  });

  describe('cart', function() {

    it('list all', function(done) {
      request(server)
        .get('/cart')
        .end(function(err, res) {
          if (err) { return done(err); }
          res.status.should.eql(200);
          var entities = res.body;
          entities.should.be.an.Array;
          entities.length.should.equal(2);
          done();
        });
    });

    it('create must be valid', function(done) {
      var cart = { foo: 'bar' };
      request(server)
        .post('/cart')
        .send(cart)
        .end(function(err, res) {
          if (err) { return done(err); }
          res.status.should.eql(400);
          done();
        });
    });

  });
});

function deleteAllCarts(done) {
  Cart.all(function(err, carts) {
    if (err) { return done(err); }
    var deleted = _.after(carts.length, done);
    _.each(carts, function(cart) {
      cart.destroy(deleted);
    });
  });
}
