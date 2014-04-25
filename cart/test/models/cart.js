'use strict';

var should = require('should');
var _ = require('lodash');
var helpers = require('../helpers');
var Cart = helpers.models.Cart;
var CartItem = helpers.models.CartItem;
var async = require('async');

describe('Models', function() {

  describe('Cart', function() {

    this.timeout(15000);
    var cart_attrs = {
      name: 'testcart',
      foo: 'bar'
    };
    var cartItem_attrs = {
      sku: '123',
      quantity: 1
    };
    var cart;

    before(function(done) {
      async.waterfall([
        function (cb) {
          Cart.find(cart_attrs.name, function (err, reply) {
            cb(null, reply);
          });
        },
        function (cart, cb) {
          if (!cart) { return cb(); }
          cart.deleteAllItems(function(err) {
              cart.delete(cb);
            }
          );
        }
      ],
        function (err, reply) {
          Cart.create(cart_attrs, function(err, reply) {
            if (err) { return done(err); }
            cart = reply;
            done();
          });
        });
    });

    after(function(done) {
      if (!cart) { return done(); }
      cart.deleteAllItems(function(err) {
        cart.delete(function(err) {
          done();
        });
      });
    });


    describe('CartItems', function() {

      var cartItem;

      after(function(done) {
        if (!cartItem) { return done(); }
        cartItem.delete(function(err) {
          done();
        });
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

      it('should be able to copy a CartItem to another Cart', function(done) {
        Cart.create({ newCart: 'yup!' }, function (err, newCart) {
          if (err) { return done(err); }
          cart.copyItems(newCart, function (err) {
            if (err) { return done(err); }
            newCart.getItems(function (err, items) {
              async.each(items,
                function (item, cb) {
                  newCart.removeItem(item, function (err) {
                    should.not.exist(err);
                    item.delete(function (err) {
                      should.not.exist(err);
                      cb();
                    });
                  });
                },
                function (cb) {
                  newCart.delete(function (err) {
                    should.not.exist(err);
                    items.length.should.equal(1);
                    items[0].get('uuid').should.not.equal(cartItem.get('uuid'));
                    items[0].get('sku').should.equal(cartItem.get('sku'));
                    done();
                  });
                }
              );
            });
          });
        });
      });

      it('should be able to close & merge a Cart', function(done) {
        Cart.create({ newCart: 'yup!' }, function (err, newCart) {
          if (err) { return done(err); }
          cart.copyAndClose(newCart, function (err) {
            if (err) { return done(err); }
            newCart.getItems(function (err, items) {
              async.each(items,
                function (item, cb) {
                  newCart.removeItem(item, function (err) {
                    should.not.exist(err);
                    item.delete(function (err) {
                      should.not.exist(err);
                      cb();
                    });
                  });
                },
                function (cb) {
                  newCart.delete(function (err) {
                    should.not.exist(err);
                    cart.get('status').should.equal('closed');
                    items.length.should.equal(1);
                    items[0].get('uuid').should.not.equal(cartItem.get('uuid'));
                    items[0].get('sku').should.equal(cartItem.get('sku'));
                    done();
                  });
                }
              );
            });
          });
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

            CartItem.find(cartItem.get('uuid'), function(err, cartItem) {
              should.not.exist(err);
              should.exist(cartItem);
              cartItem.delete(function() {
                cartItem = null;
                done();
              });
            });
          });
        });
      });

      describe('raw items', function() {

        afterEach(function(done) {
          cart.deleteAllItems(done);
        });

        it('should save and retrieve ok', function(done) {

          var itemData = [
            { sku: 123, quantity: 1 },
            { sku: 234, quantity: 2 }
          ];

          cart.set('items', itemData);
          cart.save(function(err) {
            should.not.exist(err);
            cart.fetchItems(function(err, cart) {
              should.not.exist(err);
              var items = cart.get('items');
              should.exist(items);
              items.length.should.equal(2);
              CartItem.isInstance(items[0]).should.be.true;
              CartItem.isInstance(items[1]).should.be.true;
              done();
            });
          });
        });

        it('should fail if any items are invalid', function(done) {

          var itemData = [
            { sku: 123, quantity: 1 },
            { quantity: 2 }
          ];

          cart.set('items', itemData);
          cart.save(function(err) {
            should.exist(err);
            err.hasErrors().should.be.true;
            err.getErrors('sku').should.be.an.Array;
            err.getErrors('sku').length.should.equal(1);
            err.getErrors('sku')[0].should.equal('sku is required');
            done();
          });
        });

      });
    });
  });
});
