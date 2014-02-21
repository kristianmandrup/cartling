'use strict';

var _ = require('lodash');

var addConnectionFunctions = function(owner, hasMany) {
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
          owner.getConnectedEntities(name, Class, function(err, reply) {
            cb(err, reply);
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

    name = capFirst(name);
    owner['add' + name] = functions.add;
    owner['remove' + name] = functions.remove;
    owner['get' + name + 's'] = functions.list; // todo: adding 's' is pretty ghetto
  });

  function capFirst(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  }
};

module.exports = addConnectionFunctions;
