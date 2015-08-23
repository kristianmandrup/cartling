'use strict';

module.exports = require('./my-cart');

function make404() {
  var errData = {
    statusCode: 404,
    error: 'service_resource_not_found',
    error_description: 'Service resource not found'
  };
  return new Error(errData);
}
