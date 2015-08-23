export default {
  make404: function() {
    var errData = {
      statusCode: 404,
      error: 'service_resource_not_found',
      error_description: 'Service resource not found'
    };
    return new Error(errData);
  },
  sendError: function(res, err) {
    res.body = err;
  }
}
