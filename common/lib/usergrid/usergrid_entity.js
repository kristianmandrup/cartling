'use strict';

// usergrid entity instance methods

var _ = require('lodash');
var ValidationErrors = require('./validation_errors');
var helpers = require('./helpers');
var translateSDKCallback = helpers.translateSDKCallback;
var usergrid_sdk = require('usergrid');
var async = require('async');
var inflection = require('inflection');

var UsergridEntity = function() {

  // persistence

  this.getUUID = function() {
    return this.uuid;
  };

  this.isPersisted = function() {
    return !!this.uuid;
  };

  this.save = function(cb) {
    if (!this.isValid()) { return cb(this.getErrors()); }
    var self = this;

    var connectedEntities;
    _.each(this._class._usergrid.connections, function(connectionClass, connectionName) {
      var items = self.get(connectionName);
      if (items) {
        if (!_.isArray(items) || items.length === 0) {
          items = null;
        } else {
          items = _.map(items, function(item) {
            if (connectionClass.isInstance(item)) { return item; }
            return connectionClass.new(item);
          });
          if (!connectedEntities) { connectedEntities = []; }
          connectedEntities.push({ name: connectionName, items: items });
        }
        delete(self._data[connectionName]);
      }
    });

    // validate connected entities
    // todo: capture all entities errors?
    if (connectedEntities) {
      for (var i = 0; i < connectedEntities.length; i++) {
        var connection = connectedEntities[i];
        var EntityClass = self._class._usergrid.connections[connection.name];
        for (var j = 0; j < connection.items.length; j++) {
          var item = connection.items[j];
          var entity = (EntityClass.isInstance(item)) ? item : EntityClass.new(item);
          if (!entity.isValid()) {
            return cb(entity.getErrors());
          }
        }
      }
    }

    // this deletes and replaces all connected entities that are included in the request
    // todo: this heuristic is heavy-handed and may not work in all cases
    usergrid_sdk.entity.prototype.save.call(this, translateSDKCallback(function(err, reply) { // super.save()
      if (err || !connectedEntities) { return cb(err, self); }
      async.each(connectedEntities,
        function(connection, cb) {
          async.waterfall([
            function(cb) { // delete all connected entities of this type
              var functionName = 'deleteAll' + inflection.camelize(connection.name);
              self[functionName].call(self, cb);
            },
            function(reply, cb) { // optimize to single remote call for multiple-create case
              var EntityClass = self._class._usergrid.connections[connection.name];
              EntityClass.create(connection.items, cb);
            },
            function(entities, cb) { // create connections
              var func = self['add' + inflection.singularize(inflection.camelize(connection.name))];
              async.each(entities,
                function(entity, cb) {
                  func.call(self, entity, cb);
                }, cb);
            }
          ], cb);
        }, function(err) {
          cb(err, self);
        }
      );
    }));

  };

  this.delete = function(cb) {
    var self = this;
    this.destroy(translateSDKCallback(function(err, reply) {
      cb(err, self);
    }));
  };

  // updateAttributes locally and save to server
  this.update = function(attributes, cb) {
    this.assignAttributes(attributes);
    this.save(cb);
  };

  // updates locally, no call to server
  this.assignAttributes = function(attributes) {
    if (!this._data) { this._data = {}; }
    var self = this;
    _.forOwn(attributes, function(v, k) {
      self.set(k, v);
    });
    return this;
  };

  // defines a property for a persistent attribute on this instance
  this.attr = function(name, readOnly) {
    var funcs = {};
    funcs.get = function() { return this.get(name); };
    if (!readOnly) {
      funcs.set = function(v) { this.set(name, v); };
    }
    Object.defineProperty(this, name, funcs);
  };

  // connections

  // connectedType is the defined() type of the connected entity
  this.getConnectedEntities = function(name, connectedType, options, cb) {
    if (_.isFunction(options)) { cb = options; options = undefined; }
    // call up to the sdk getConnections
    this.getConnections(name, options, function(err, reply) {
      if (err) { return translateSDKCallback(cb); }
      var entities = _.map(reply.entities, function(entity) {
        return connectedType.new(entity);
      });
      cb(null, entities);
    });
  };

  // hash of (plural) name -> path
  this.getConnectingPaths = function() {
    return this._data.metadata.connecting;
  };

  // hash of (plural) name -> path
  this.getConnectionPaths = function() {
    return this._data.metadata.connected;
  };

  // validation

  this.addError = function(attribute, error) {
    if (!this._errors) { this._errors = new ValidationErrors(); }
    this._errors.addError(attribute, error);
  };

  this.clearErrors = function() {
    this._errors = new ValidationErrors();
  };

  this.getErrors = function() {
    return this._errors;
  };

  this.validate = function() {
    var self = this;
    self.clearErrors();
    var validations = this._class._usergrid.validations;
    _.each(validations, function(validations, name) {
      var value = self.get(name);
      _.each(validations, function(validator) {
        var err = validator(value);
        if (err) { self.addError(name, err); }
      });
    });
    return self._errors;
  };

  this.isValid = function() {
    return !(this.validate().hasErrors());
  };


  // utility

  this.toString = function() {
    var str = '';
    if (this._data) {
      if (this._data.type) {
        str += this._data.type;
      }
      if (this._data.name) {
        str += '[' + this._data.name + ']';
      } else {
        str += '[' + this._data.uuid + ']';
      }
    } else {
      str = '{}';
    }
    return str;
  };

  this.toJSON = function() {
    return this._data;
  };
};
module.exports = UsergridEntity;
