'use strict';

var should = require('should');
var _ = require('lodash');
var helpers = require('../helpers');
var Cart = helpers.models.Cart;
var CartItem = helpers.models.CartItem;

describe('Cart Model', function() {

  this.timeout(10000);
  var cart_attrs = {
    name: 'testcart',
    foo: 'bar'
  };
  var cartItem_attrs = {
    name: 'testcartitem',
    sku: '123',
    quantity: 1
  };
  var cart;

  before(function(done) {
    Cart.delete(cart_attrs.name, function(err, reply) {
      Cart.create(cart_attrs, function(err, reply) {
        if (err) { return done(err); }
        cart = reply;

        CartItem.delete(cartItem_attrs.name, function(err, reply) {
          done();
        });
      });
    });
  });

  after(function(done) {
    if (cart) {
      cart.delete(function(err) {
        done();
      });
    }
  });


  describe('hasMany CartItems', function() {

    var cartItem;

    after(function(done) {
      if (cartItem) {
        cartItem.delete(function(err) {
          done();
        });
      }
    });

    it('should be able to add a CartItem', function(done) {
      CartItem.create(cartItem_attrs, function(err, item) {
        should.not.exist(err);

        cart.addItem(item, function(err, reply) {
          should.not.exist(err);
          should.exist(reply);
          cartItem = item;
          done();
        });
      });
    });

    it('should be able to list CartItems', function(done) {
      cart.getItems(function(err, items) {
        should.not.exist(err);
        should.exist(items);
        items.length.should.equal(1);
        items[0].get('uuid').should.equal(cartItem.get('uuid'));
        CartItem.isInstance(items[0]).should.be.true;
        Cart.isInstance(items[0]).should.not.be.true;
        done();
      });
    });

    it('should be able to remove a CartItem', function(done) {
      cart.removeItem(cartItem, function(err, reply) {
        should.not.exist(err);
        should.exist(reply);

        cart.getItems(function(err, items) {
          should.not.exist(err);
          should.exist(items);
          items.length.should.equal(0);

          CartItem.find(cartItem_attrs.name, function(err, cartItem) {
            should.not.exist(err);
            should.exist(cartItem);
            cartItem.delete(function() {
              done();
            });
          });
        });
      });
    });

  });
});

