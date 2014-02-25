'use strict';

var _ = require('lodash');
var inflection = require('inflection');
var UsergridError = require('./usergrid_error');

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

      get:
        function(id, cb) {
          if (!id) { cb(new Error('id required')); }
          owner.getConnectedEntities(name, Class, function(err, entities) {
            if (err) { return cb(err); }
            var entity = _.find(entities, function(ea) {
              return (ea.get('uuid') === id || ea.get('name') === id);
            });
            if (!entity) {
              var errData = {
                statusCode: 404,
                name: 'service_resource_not_found',
                message: 'Service resource not found'
              };
              return cb(new UsergridError(errData));
            }
            cb(null, entity);
          });
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
    owner['get' + singularName] = functions.get;
    owner['get' + pluralName] = functions.list;
    owner['deleteAll' + pluralName] = functions.list;

  });

};

module.exports = addConnectionFunctions;
