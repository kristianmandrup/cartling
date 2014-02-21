'use strict';

var should = require('should');
var _ = require('lodash');
var helpers = require('../helpers');
var User = helpers.models.User;
var Cart = helpers.models.Cart;

describe('User Model', function() {

  this.timeout(10000);
  var user_attrs = {
    username: 'foobar',
    foo: 'bar'
  };
  var cart_attrs = {
    name: 'cartfoo'
  };
  var user;

  before(function(done) {
    User.delete(user_attrs.username, function(err, reply) {
      User.create(user_attrs, function(err, reply) {
        if (err) { return done(err); }
        user = reply;

        Cart.delete(cart_attrs.name, function(err, reply) {
          done();
        });
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

  describe('hasMany Carts', function() {

    var cart;

    after(function(done) {
      if (cart) {
        cart.delete(function(err) {
          done();
        });
      }
    });

    it('should be able to add a Cart', function(done) {
      Cart.create(cart_attrs, function(err, item) {
        should.not.exist(err);

        user.addCart(item, function(err, reply) {
          should.not.exist(err);
          should.exist(reply);
          cart = item;
          done();
        });
      });
    });

    it('should be able to list Carts', function(done) {
      user.getCarts(function(err, carts) {
        should.not.exist(err);
        should.exist(carts);
        carts.length.should.equal(1);
        carts[0].get('uuid').should.equal(cart.get('uuid'));
        Cart.isInstance(carts[0]).should.be.true;
        User.isInstance(carts[0]).should.not.be.true;
        done();
      });
    });

    it('should be able to remove a Cart', function(done) {
      user.removeCart(cart, function(err, reply) {
        should.not.exist(err);
        should.exist(reply);

        user.getCarts(function(err, items) {
          should.not.exist(err);
          should.exist(items);
          items.length.should.equal(0);
          done();
        });
      });
    });

  });
});

