'use strict';

var _ = require('lodash');
var ValidationErrors = require('./validation_errors');

var Usergrid = function() {

  // persistence

  this._errors = {};

  this.save = function(cb) {
    if (!this.isValid()) { return cb(this.getErrors()); }
    this.prototype.save(cb);
  };

  // updates locally, no call to server
  this.updateAttributes = function(attributes) {
    if (!this._data) { this._data = {}; }
    var self = this;
    _.forOwn(attributes, function(v, k) {
      self.set(k, v);
    });
    return this;
  };

  // validation

  this.validates = function(validations) {
    this._validations = validations;
  };

  this.addError = function(attribute, error) {
    this._errors.addError(attribute, error);
  };

  this.clearErrors = function() {
    this._errors = new ValidationErrors();
  };

  // return a single Error object wrapping ValidationErrors
  this.getError = function() {
    return this.getErrors().asError();
  };

  this.getErrors = function() {
    return this._errors;
  };

  this.validate = function() {
    var self = this;
    self.clearErrors();
    _.each(self._validations, function(validations, name) {
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
    return JSON.stringify(this._data);
  };
};
module.exports = Usergrid;