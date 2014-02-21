'use strict';

var _ = require('lodash');
var inflection = require('inflection');

var addConnectionFunctions = function(owner, hasMany) {
  if (!hasMany) { return; }
  _.each(hasMany, function(Class, name) {

    var connectionName = inflection.singularize(name);

    var functions = {
      add:
        function(entity, cb) {
          owner.connect(connectionName, entity, function(err) {
            cb(err, entity);
          });
        },

      remove:
        function(entity, cb) {
          owner.disconnect(connectionName, entity, function(err) {
            cb(err, entity);
          });
        },

      list:
        function(cb) {
          owner.getConnectedEntities(connectionName, Class, function(err, reply) {
            cb(err, reply);
          });
        },

      deleteAll:
        function(cb) {
          owner.getConnectedEntities(connectionName, Class, function(err, entities) {
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
    owner['deleteAll' + pluralName] = functions.list;

  });

};

module.exports = addConnectionFunctions;
