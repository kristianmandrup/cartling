'use strict';

var _ = require('lodash');
var util = require('util');

// errors is a hash of name -> errors
function ValidationErrors(errors) {
  this.errors = errors ? errors : {};

  this.addError = function(field, message) {
    if (!this.errors[field]) { this.errors[field] = []; }
    this.errors[field].push(util.format(message, field));
  };

  // omit field for full hash of errors
  this.getErrors = function(field) {
    if (field) {
      return this.errors[field];
    } else {
      return this.errors;
    }
  };

  this.hasErrors = function() {
    return _.keys(this.errors).length > 0;
  };

  this.asError = function() {
    var err = new Error('Validation errors');
    err.validationErrors = this.getErrors();
    return err;
  };
}
module.exports = ValidationErrors;
