// statics - applied to defined usergrid "class" objects //
'use strict';

var _ = require('lodash');
var UsergridEntity = require('./usergrid_entity');
var translateSDKCallback = require('./helpers').translateSDKCallback;
var async = require('async');
var addConnectionFunctions = require('./has_many');
var usergrid_sdk = require('usergrid');
var buildQuery = require('./helpers').buildQuery;

var ClassStatics = function(client) {

  return {

    immutableFields:
      function(includeUUID) {
        var fields = ['metadata', 'created', 'modified', 'type'];
        if (includeUUID) { fields.push('uuid'); }
        return fields;
      },

    hasMany:
      function(connectionName, connectionClass) {
        if (!this._usergrid.connections) { this._usergrid.connections = {}; }
        this._usergrid.connections[connectionName] = connectionClass;
      },

    isInstance:
      function(instance) {
        return instance._class === this;
      },

    defaults:
      function(hash) {  // field_name -> value
        this._usergrid.defaults = hash;
      },

    validates:
      function(validations) {  // field_name -> [ validator_function ]
        _.each(validations, function(validators, name) {
          _.each(validators, function(validator) {
            if (!_.isFunction(validator)) {
              throw new Error('bad validator for field: ' + name);
            }
          });
        });
        if (!this._usergrid.validations) { this._usergrid.validations = {}; }
        _.assign(this._usergrid.validations, validations);
      },

    all:
      function(cb) {
        this.findBy(null, cb);
      },

    // retrieve a single entity by uuid or unique name
    find:
      function(uuid_or_name, cb) {
        var self = this;
        client.getEntity({ type: self._usergrid.type, uuid: uuid_or_name }, translateSDKCallback(function (err, entity) {
          if (err) { return cb(err); }
          cb(null, wrap(self, entity));
        }));
      },

    // query with attributes - returns an array of entities
    // limit is optional
    findBy:
      function(criteria, limit, cb) {
        if (_.isFunction(limit)) { cb = limit; limit = undefined; }
        var self = this;
        var query = buildQuery(criteria, limit);
        client.createCollection(options(self, query), translateSDKCallback(function (err, collection) {
          if (err) { return cb(err); }
          cb(null, wrapCollection(self, collection));
        }));
      },

    // creates entity immediately on the server w/ attributes and returns the entity
    create:
      function(attributes, cb) {
        // todo: validate no uuid?
        var entity = this.new(attributes);
        entity.save(cb);
      },

    // updates entity immediately on the server w/ attributes and returns the entity
    update:
      function(attributes, cb) {
        var id = attributes.uuid || attributes.name || attributes.username;
        this.find(id, function (err, entity) {
          entity.update(attributes, cb);
        });
      },

    first:
      function(criteria, cb) {
        this.findBy(criteria, 1, function(err, entities) {
          if (err) { return cb(err); }
          cb(null, entities[0]);
        });
      },

    // searches for a record with criteria, creates it with criteria if not found
    findOrCreate:
      function(criteria, cb) {
        var self = this;
        this.first(criteria, function(err, entity) {
          if (err) { return cb(err); }
          if (entity) {
            cb(null, entity);
          } else {
            self.create(criteria, cb);
          }
        });
      },

    // deletes (does not retrieve) the entity on the service with the passed id
    delete:
      function(uuid_or_name, cb) {
        var entity = this.new(uuid_or_name);
        entity.delete(cb);
      },

    // destroys (does not retrieve) all entities matching criteria (criteria is optional)
    // returns num of entities deleted to callback
    deleteAll:
      function(criteria, cb) {
        if (_.isFunction(criteria)) { cb = criteria; criteria = undefined; }
        var self = this;
        var query = buildQuery(criteria);
        client.delete(options(self, query), translateSDKCallback(function (err, data) {
          if (err) { return cb(err); }
          cb(null, data.entities.length);
        }));
      },

    // destroys (retrieve and delete) all entities matching criteria (criteria is optional)
    destroyAll:
      function(criteria, cb) {
        if (_.isFunction(criteria)) { cb = criteria; criteria = undefined; }
        this.findBy(criteria, function(err, entities) {
          if (err) { return cb(err); }
          var deleteEntity = function(entity, callback) {
            entity.delete(callback);
          };
          async.each(entities, deleteEntity, function(err) {
            cb(err);
          });
        });
      },

    new:
      function(attributes) {
        if (_.isString(attributes)) { attributes = { uuid: attributes }; } // assume it's a uuid
        var data = {};
        _.assign(data, this._usergrid.defaults);
        _.assign(data, attributes);
        data.type = this._usergrid.type;
        return wrap(this, new usergrid_sdk.entity({data: data, client: client}));
      }
  };
};

// utility methods

// clones hash and adds type for usergrid context
function options(_class, hash) {
  var opts;
  var type = { type: _class._usergrid.type };
  if (hash) {
    opts = _.clone(hash);
    _.assign(opts, type);
  } else {
    opts = type;
  }
  return opts;
}

// Create a new typed entity from the passed sdk Usergrid.Entity.
// Assigns prototypes as follows:
//   [defined entity] -> [this UsergridEntity()] -> [sdk Usergrid.Entity()]
function wrap(_class, entity) {
  UsergridEntity.prototype = entity;
  _class._usergrid.constructor.prototype = new UsergridEntity();
  entity = new _class._usergrid.constructor();
  entity._class = _class;
  addConnectionFunctions(entity, _class._usergrid.connections);
  return entity;
}

function wrapCollection(_class, collection) {
  var entities = [];
  while (collection.hasNextEntity()) {
    var entity = collection.getNextEntity();
    entities.push(wrap(_class, entity));
  }
  return entities;
}

module.exports = ClassStatics;
