'use strict';

function UsergridError(data) {
  this.name = data.error;
  this.message = data.error_description;
}
UsergridError.prototype = new Error();
UsergridError.prototype.constructor = UsergridError;

module.exports = UsergridError;
