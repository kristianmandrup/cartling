'use strict';

var should = require('should');
var _ = require('lodash');
var Foo = require('./foo');

describe('Base Model', function() {

  this.timeout(10000);
  var TEST_ID = 'test';
  var TEST_ATTRS = { name: TEST_ID, foo: 'bar' };
  var cart;

  before(function(done) {
    Foo.destroyAll(done);
  });

  it('create', function(done) {
    Foo.create(TEST_ATTRS, function(err, entity) {
      should.not.exist(err);
      checkEntity(entity);
      cart = entity;
      done();
    });
  });

  it('create requires name', function(done) {
    var criteria = { foo: 'baz'};
    Foo.create(criteria, function(err, entity) {
      should.exist(err);
      err.hasErrors().should.be.true;
      err.getErrors('name').should.be.an.Array;
      err.getErrors('name').length.should.equal(1);
      err.getErrors('name')[0].should.equal('name is required');

      Foo.find(TEST_ID, function(err, entity) {
        should.not.exist(err);
        checkEntity(entity);
        done();
      });
    });
  });

  it('create w/ email requires email format', function(done) {
    var criteria = { name: 'baz', email: 'myemail@address'};
    Foo.create(criteria, function(err, entity) {
      should.exist(err);
      err.hasErrors().should.be.true;
      should.exist(err.getErrors('email'));
      err.getErrors('email').should.be.an.Array;
      err.getErrors('email').length.should.equal(1);
      err.getErrors('email')[0].should.equal('email is not a valid email address');

      criteria.email = 'myemail@address.com';
      Foo.create(criteria, function(err, entity) {
        should.not.exist(err);
        done();
      });
    });
  });

  it('find', function(done) {
    Foo.find(TEST_ID, function(err, entity) {
      should.not.exist(err);
      checkEntity(entity);
      done();
    });
  });

  it('findBy', function(done) {
    Foo.findBy(TEST_ATTRS, function(err, collection) {
      should.not.exist(err);
      checkCollection(collection);
      done();
    });
  });

  it('updateAttributes and save', function(done) {
    var attrs = { boo: 'bif' };
    cart.assignAttributes(attrs);
    cart.get('boo').should.equal(attrs.boo);
    cart.save(function(err, reply) {
      should.not.exist(err);
      reply.get('boo').should.equal(attrs.boo);
      done();
    });
  });

  it('delete', function(done) {
    if (!cart) { done(); }
    cart.delete(function(err) {
      should.not.exist(err);
      Foo.find(TEST_ID, function(err, entity) {
        should.exist(err);
        should.not.exist(entity);
        cart = null;
        done();
      });
    });
  });


  function checkCollection(collection, expectedSize) {
    should.exist(collection);
    if (expectedSize) {
      collection.length.should.equal(expectedSize);
    }
    _.each(collection, function(entity) {
      checkEntity(entity);
    });
  }

  function checkEntity(entity) {
    should.exist(entity);
    _.each(TEST_ATTRS, function(v,k) {
      v.should.equal(entity.get(k));
    });
  }

});
