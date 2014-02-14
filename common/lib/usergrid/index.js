/*
  Module wraps the Usergrid SDK to enable Rails-style typed models and mixins.
 */
'use strict';

var _ = require('lodash');
var usergrid_sdk = require('usergrid');
var Usergrid = require('./usergrid');
var validators = require('./validators');
var ValidationErrors = require('./validation_errors');
var client;

function configure(config) {
  client = new usergrid_sdk.client(_.assign({ authType: usergrid_sdk.AUTH_CLIENT_ID}, config));
  exports.client = client;
  exports.define = define;
}

// type is optional. if omitted, constructor name is used as type.
function define(clazz, constructor, type) {
  if (!client) { throw new Error('phrixus-common not configured'); }
  clazz._usergrid = {
    constructor: constructor,
    type: (type) ? type : constructor.name.toLowerCase()
  };
  _.mixin(clazz, UsergridStatics);
}

var exports = {
  validators: validators,
  ValidationErrors: ValidationErrors
};

module.exports = function(config) {
  if (config && config.usergrid) { configure(config.usergrid); }
  return exports;
};


// statics //

var UsergridStatics = {

  all:
    function(cb) {
      this.findBy({}, cb);
    },

  // retrieve an entity by uuid or unique name
  find:
    function(uuid_or_name, cb) {
      var self = this;
      client.getEntity({ type: self._usergrid.type, uuid: uuid_or_name }, function (err, entity) {
        if (err) { return cb(err); }
        cb(null, wrap(self, entity));
      });
    },

  // query with attributes - returns an array of entities
  findBy:
    function(criteria, cb) {
      var self = this;
      var ql = buildQuery(criteria);
      var query = { qs: { ql: ql }};
      client.createCollection(options(self, query), function (err, collection) {
        if (err) { return cb(err); }
        cb(null, wrapCollection(self, collection));
      });
    },

  // creates entity immediately on the server w/ attributes and returns the entity
  create:
    function(attributes, cb) {
      var self = this;
      var test = newEntity(self, attributes);
      if (!test.isValid()) { return cb(test.getErrors()); }
      client.createEntity(options(self, attributes), function (err, entity) {
        if (err) { return cb(err); }
        cb(null, wrap(self, entity));
      });
    },

  // updates entity immediately on the server w/ attributes and returns the entity
  update:
    function(attributes, cb) {
      var self = this;
      var test = newEntity(self, attributes);
      if (!test.isValid()) { return cb(test.getErrors()); }
      test.save(options(self, attributes), function (err, entity) {
        if (err) { return cb(err); }
        cb(null, wrap(self, entity));
      });
    }
};

// transforms attributes into QL - note 'order' is treated as 'order by'
// if it's a string, it just assumes the string is already a valid QS
// eg. { a: 'b', c: 'd' } -> "a = 'b' and c = 'd'"
function buildQuery(options) {
  if (_.isString(options)) { return options; }
  var qs = '';
  var order = '';
  _.forOwn(options, function(v, k) {
    if (k === 'order') {
      order = 'order by ' + v;
    } else {
      qs += k + "= '" + v + "' ";
    }
  });
  return qs;
}

// clones hash and adds type for usergrid context
function options(clazz, hash) {
  var opts;
  var type = { type: clazz._usergrid.type };
  if (hash) {
    opts = _.clone(hash);
    _.assign(opts, type);
  } else {
    opts = type;
  }
  return opts;
}

function newEntity(self, attributes) {
  var entity = wrap(self, new usergrid_sdk.entity());
  if (attributes) {
    entity.updateAttributes(attributes);
  }
  return entity;
}

// Create a new typed entity from the passed sdk Usergrid.Entity.
// Assigns prototypes as follows:
//   [defined entity] -> [this Usergrid()] -> [sdk Usergrid.Entity()]
function wrap(clazz, entity) {
  Usergrid.prototype = entity;
  clazz._usergrid.constructor.prototype = new Usergrid();
  return new clazz._usergrid.constructor();
}

function wrapCollection(clazz, collection) {
  var entities = [];
  while (collection.hasNextEntity()) {
    var entity = collection.getNextEntity();
    entities.push(wrap(clazz, entity));
  }
  return entities;
}
