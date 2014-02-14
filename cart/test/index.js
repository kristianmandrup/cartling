'use strict';

var should = require('should');
var Url = require('url');
var request = require('supertest');
var querystring = require('querystring');
var _ = require('lodash');

var helpers = require('./helpers');
var models = helpers.models;
var Cart = models.Cart;
var CartItem = models.CartItem;

var server = require('./app')(helpers.config);

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

    describe('create', function() {

      it('can succeed', function(done) {
        var attrs = { name: 'skippy' };
        request(server)
          .post('/cart')
          .send(attrs)
          .end(function(err, res) {
            if (err) { return done(err); }
            res.status.should.eql(200);
            var cart = JSON.parse(res.body);
            cart.uuid.should.not.be.null;
            cart.name.should.equal('skippy');
            done();
          });
      });

      it('is validated', function(done) {
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

      describe('update', function() {

        it('can update from uuid', function(done) {
          var body = { bar: 'babs' };
          request(server)
            .put('/cart/' + carts[1].get('uuid'))
            .send(body)
            .end(function(err, res) {
              if (err) { return done(err); }
              res.status.should.eql(200);
              var cart = JSON.parse(res.body);
              cart.bar.should.equal('babs');
              done();
            });
        });

//        it.only('is validated', function(done) {
//          var cart = { foo: 'bar' };
//          request(server)
//            .post('/cart')
//            .send(cart)
//            .end(function(err, res) {
//              if (err) { return done(err); }
//              res.status.should.eql(400);
//              done();
//            });
//        });

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
