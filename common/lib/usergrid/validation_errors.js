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

  this.isValidationErrors = function() {
    return true;
  };
}
module.exports = ValidationErrors;

ValidationErrors.prototype = new Error();
ValidationErrors.prototype.constructor = ValidationErrors;
