'use strict';

var _ = require('lodash');
var inflection = require('inflection');
var buildQuery = require('./helpers').buildQuery;

var addConnectionFunctions = function(owner, hasMany) {
  if (!hasMany) { return; }
  _.each(hasMany, function(Class, name) {

    var functions = {
      add:
        function(entity, cb) {
          owner.connect(name, entity, function(err) {
            cb(err, entity);
          });
        },

      remove:
        function(entity, cb) {
          owner.disconnect(name, entity, function(err) {
            cb(err, entity);
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
          this.findBy(criteria, 1, cb);
        },

      // note: special cases "_id" as "uuid" OR "name"
      findBy:
        function(criteria, limit, cb) {
          if (_.isFunction(limit)) { cb = limit; limit = undefined; }
          if (!criteria) { cb(new Error('criteria required')); }
          var query = buildQuery(criteria, limit);
          owner.getConnectedEntities(name, Class, query, cb);
        },

      deleteAll:
        function(cb) {
          owner.getConnectedEntities(name, Class, function(err, entities) {
            _.each(entities, function(entity) {
              entity.delete();
            });
          });
        }
    };

    var pluralName = inflection.camelize(name);
    var singularName = inflection.singularize(pluralName);

    owner['add' + singularName] = functions.add;
    owner['remove' + singularName] = functions.remove;
    owner['get' + pluralName] = functions.list;
    owner['deleteAll' + pluralName] = functions.deleteAll;
    owner['find' + pluralName + 'By'] = functions.findBy;
  });

};

module.exports = addConnectionFunctions;
