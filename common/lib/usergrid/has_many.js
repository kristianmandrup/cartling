'use strict';

var _ = require('lodash');
var inflection = require('inflection');
var buildQuery = require('./helpers').buildQuery;
var async = require('async');

var addConnectionFunctions = function(owner, hasMany) {
  if (!hasMany) { return; }
  _.each(hasMany, function(Class, name) {

    var pluralName = inflection.camelize(name);
    var singularName = inflection.singularize(pluralName);

    var functions = {
      add:
        function(entity, cb) {
          async.waterfall([
            function(cb) {
              if (entity.isPersisted()) { return cb(null, entity); }
              entity.save(cb);
            },
            function(entity, cb) {
              owner.connect(name, entity, function(err) {
                cb(err, owner);
              });
            }
          ], cb);
        },

      remove:
        function(entity, cb) {
          owner.disconnect(name, entity, function(err) {
            cb(err, owner);
          });
        },

      list:
        function(cb) {
          owner.getConnectedEntities(name, Class, function(err, entities) {
            cb(err, entities);
          });
        },

      find:
        function(id, cb) {
          if (!id) { cb(new Error('id required')); }
          var criteria = { _id: id };
          functions.findBy(criteria, 1, function(err, carts) {
            if (err) { return cb(err); }
            cb(null, carts[0]);
          });
        },

      // note: special cases "_id" as "uuid" OR "name"
      findBy:
        function(criteria, limit, cb) {
          if (_.isFunction(limit)) { cb = limit; limit = undefined; }
          if (!criteria) { cb(new Error('criteria required')); }
          var query = buildQuery(criteria, limit);
          owner.getConnectedEntities(name, Class, query, cb);
        },

      delete:
        function(id, cb) {
          functions.find(id, function(err, entity) {
            if (err) { return cb(err); }
            entity.delete(function(err) {
              cb(err, owner);
            });
          });
        },

      deleteAll:
        function(cb) {
          owner.getConnectedEntities(name, Class, function(err, entities) {
            if (err) { return cb(err); }
            _.each(entities, function(entity) {
              entity.delete(function(err) {
                cb(err, owner);
              });
            });
          });
        },

      fetch:
        function(cb) {
          functions.list(function(err, items) {
            if (err) { return cb(err); }
            owner.set(name, items);
            cb(null, owner);
          });
        }
    };

    owner['add' + singularName] = functions.add;
    owner['remove' + singularName] = functions.remove;
    owner['find' + singularName] = functions.find;
    owner['get' + pluralName] = functions.list;
    owner['delete' + singularName] = functions.delete;
    owner['deleteAll' + pluralName] = functions.deleteAll;
    owner['find' + pluralName + 'By'] = functions.findBy;
    owner['fetch' + pluralName] = functions.fetch;
  });

};

module.exports = addConnectionFunctions;
