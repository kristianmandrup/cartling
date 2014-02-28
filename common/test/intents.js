'use strict';

var should = require('should');
var _ = require('lodash');
var async = require('async');
var intents = require('./helpers').intents;

describe('Intents', function() {

  this.timeout(991000);
  var tracker;

  beforeEach(function(done) {
    tracker = new Tracker();
    done();
  });

  afterEach(function(done) {
    intents.clearAll();
    done();
  });

  it('can pass through explicit match', function(done) {
    intents.before('create', 'type', tracker.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      should.not.exist(err);
      tracker.called.should.be.true;
      done();
    });
  });

  it('can abort an explicit match', function(done) {
    intents.before('create', 'type', abort);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      should.exist(err);
      done();
    });
  });

  it('catches callback errors', function(done) {
    intents.before('create', 'type', raiseErr);
    intents.verifyIntent('type', 'create', 'type', 'data', function(err) {
      should.exist(err);
      done();
    });
  });

  it('matches wildcard type', function(done) {
    intents.before('create', '*', tracker.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      tracker.called.should.be.true;
      done();
    });
  });

  it('matches wildcard operation', function(done) {
    intents.before('*', 'type', tracker.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      tracker.called.should.be.true;
      done();
    });
  });

  it('matches double wildcard', function(done) {
    intents.before('*', '*', tracker.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      tracker.called.should.be.true;
      done();
    });
  });

  it('doesn\'t match wrong type', function(done) {
    intents.before('create', 'othertype', tracker.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      tracker.called.should.be.false;
      done();
    });
  });

  it('doesn\'t match wrong op', function(done) {
    intents.before('read', 'type', tracker.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      tracker.called.should.be.false;
      done();
    });
  });

  it('calls multiple matches', function(done) {
    var tracker2 = new Tracker();
    intents.before('create', 'type', tracker.ok);
    intents.before('create', 'type', tracker2.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      tracker.called.should.be.true;
      tracker2.called.should.be.true;
      done();
    });
  });

  it('short circuits abort with multiple matches', function(done) {
    intents.before('create', 'type', abort);
    intents.before('create', 'type', tracker.ok);
    intents.verifyIntent('subject', 'create', 'type', 'data', function(err) {
      tracker.called.should.be.false;
      done();
    });
  });

});

function Tracker() {
  this.called = false;
  this.ok = function(intent, ok) { this.called = true; ok(); }.bind(this);
}

function abort(intent, ok) { ok(new Error('abort!')); }
function raiseErr(intent, ok) { throw new Error('oh no!'); }
