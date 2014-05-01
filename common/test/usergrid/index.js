'use strict';

var should = require('should');
var _ = require('lodash');
var Foo = require('./foo');
var Bar = require('./bar');
var async = require('async');

describe('Base Model', function() {

  this.timeout(10000);
  var TEST_ID = 'test';
  var TEST_ATTRS = { name: TEST_ID, foo: 'bar' };
  var foo;

  before(function(done) {
    async.parallel([
      function(cb) {
        Foo.deleteAll(cb);
      },
      function(cb) {
        Bar.deleteAll(cb);
      }
    ],
    done);
  });

  after(function(done) {
    async.parallel([
      function(cb) {
        Foo.deleteAll(cb);
      },
      function(cb) {
        Bar.deleteAll(cb);
      }
    ],
      done);
  });

  it('create', function(done) {
    Foo.create(TEST_ATTRS, function(err, entity) {
      should.not.exist(err);
      checkEntity(entity);
      foo = entity;
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

      Foo.findBy(criteria, function(err, entities) {
        should.not.exist(err);
        entities.length.should.equal(0);
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
    foo.assignAttributes(attrs);
    foo.get('boo').should.equal(attrs.boo);
    foo.save(function(err, reply) {
      should.not.exist(err);
      reply.get('boo').should.equal(attrs.boo);
      done();
    });
  });

  it('update an instance-declared attribute and save', function(done) {
    foo.attr('boo');
    foo.boo.should.equal('bif');
    foo.boo = 'bop';
    foo.save(function(err, reply) {
      should.not.exist(err);
      reply.boo.should.equal('bop');
      done();
    });
  });

  it('should have read only metadata', function(done) {
    should.exist(foo.uuid);
    (function() { foo.uuid = 'xxx'; }).should.throw();
    should.exist(foo.created);
    (function() { foo.created = 'xxx'; }).should.throw();
    should.exist(foo.modified);
    (function() { foo.modified = 'xxx'; }).should.throw();
    should.exist(foo.type);
    (function() { foo.type = 'xxx'; }).should.throw();
    done();
  });

  it('update a class-declared attribute and save', function(done) {
    foo.email = 'test@test.com';
    foo.save(function(err, reply) {
      should.not.exist(err);
      reply.email.should.equal(foo.email);
      done();
    });
  });

  it('should save and retrieve sub-collections', function(done) {
    var barAttrs = [{bar: 1}, {bar: 2}];
    foo.set('bars', barAttrs);
    foo.save(function(err) {
      should.not.exist(err);
      foo.fetchBars(function(err, cart) {
        should.not.exist(err);
        var bars = cart.bars;
        should.exist(bars);
        bars.length.should.equal(2);
        Bar.isInstance(bars[0]).should.be.true;
        Bar.isInstance(bars[1]).should.be.true;
        foo.deleteAllBars(function(err, reply) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  it('delete', function(done) {
    if (!foo) { done(); }
    foo.delete(function(err) {
      should.not.exist(err);
      Foo.find(TEST_ID, function(err, entity) {
        should.exist(err);
        should.not.exist(entity);
        foo = null;
        done();
      });
    });
  });

  it('deleteAll', function(done) {
    var barAttrs = [{bar: 1}, {bar: 2}, {bar: 3}];
    async.each(barAttrs,
      function(attrs, cb) {
        Bar.create(attrs, cb);
      },
      function(err) {
        should.not.exist(err);

        Bar.all(function (err, reply) {
          should.not.exist(err);
          reply.length.should.equal(barAttrs.length);

          var query = 'bar < 3';
          Bar.deleteAll(query, function (err, reply) {
            should.not.exist(err);
            reply.should.equal(2);

            Bar.all(function(err, reply) {
              should.not.exist(err);
              reply.length.should.equal(1);
              reply[0].get('bar').should.equal(3);

              Bar.deleteAll(function(err, reply) {
                should.not.exist(err);
                reply.should.equal(1);

                Bar.all(function(err, reply) {
                  should.not.exist(err);
                  reply.length.should.equal(0);

                  done();
                });
              });
            });
          });
        });
      }
    );
  });

  it('batch create', function(done) {
    var barAttrs = [{bar: 1}, {bar: 2}, {bar: 3}];
    Bar.create(barAttrs, function(err, entities) {
      should.not.exist(err);

      Bar.all(function (err, reply) {
        should.not.exist(err);
        reply.length.should.equal(barAttrs.length);

        barAttrs[1].bar.should.equal(reply[1].get('bar'));
        done();
      });
    });
  });

  it('batch create also validates', function(done) {
    var criteria = { foo: 'baz'};
    Foo.create([criteria], function(err, entity) {
      should.exist(err);
      err.hasErrors().should.be.true;
      err.getErrors('name').should.be.an.Array;
      err.getErrors('name').length.should.equal(1);
      err.getErrors('name')[0].should.equal('name is required');

      Foo.findBy(criteria, function(err, entities) {
        should.not.exist(err);
        entities.length.should.equal(0);
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
