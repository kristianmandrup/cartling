export default function() {
  var errData = {
    statusCode: 404,
    error: 'service_resource_not_found',
    error_description: 'Service resource not found'
  };
  return new Error(errData);
}
