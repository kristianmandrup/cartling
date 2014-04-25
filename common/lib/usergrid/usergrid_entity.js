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
    return this.get('uuid');
  };

  this.isPersisted = function() {
    return !!this.getUUID();
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

    usergrid_sdk.entity.prototype.save.call(this, translateSDKCallback(function(err, reply) { // super.save()
      if (err || !connectedEntities) { return cb(err, self); }
      async.each(connectedEntities,
        function(connection, cb) {
          async.waterfall([ // delete and replace all connected entities when included
            function(cb) {
              var functionName = 'deleteAll' + inflection.camelize(connection.name);
              self[functionName].call(self, cb);
            },
            function(cart, cb) {
              async.each(connection.items,
                function(item, cb) {
                  cart.addItem(item, cb);
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
