'use strict';

var UsergridError = require('./usergrid_error');
var _ = require('lodash');

module.exports = {

  translateSDKCallback:
    function (cb) {
      return function (err, entity, data) {
        if (err && data && data.error) {
          cb(new UsergridError(data));
        } else if (err && entity && entity.error) {
          cb(new UsergridError(entity));
        } else {
          cb(err, entity);
        }
      };
    },

  request:
    function(options, cb) {
      var usergrid = require('../usergrid')(); // done here to be after initialization
      usergrid.client.request(options, this.translateSDKCallback(cb));
    },

  buildQuery:
    // transforms query-by-example criteria into a query for Usergrid (ANDs all attributes together)
    // if the criteria is a string, it is assumed to already be a valid Usergrid query
    // note: _id is translated into either 'uuid' (if it is a uuid) or 'name'
    // eg. { a: 'b', c: 'd' } -> "a = 'b' and c = 'd'"
    function(criteria, limit) {
      if (!criteria && !limit) { return { qs: {} }; }
      if (!criteria) { criteria = {}; }
      var queryString;
      if (_.isString(criteria)) {
        queryString = criteria;
      } else {
        var orderby = criteria['order by'];
        if (orderby) { delete criteria['order by']; }
//        limit = limit || criteria.limit;
//        delete criteria.limit;
        if (criteria._id) {
          if (isUUID(criteria._id)) {
            criteria.uuid = criteria._id;
          } else {
            criteria.name = criteria._id;
          }
          delete criteria._id;
        }
        queryString = _.reduce(criteria,
          function(result, v, k) {
            result = result ? result + ' and ' : '';
            return result + k + "=" + quote(v);
          },
          null);
        if (orderby) { queryString += (' ' + orderby); }
      }
      var query = { qs: { q: queryString }};
      if (limit) { query.qs.limit = limit; }
      return query;
    }
};

function quote(val) {
  return _.isString(val) && !isUUID(val) ? ("'" + val + "'") : val;
}

function isUUID(uuid) {
  var uuidValueRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuid) { return false; }
  return uuidValueRegex.test(uuid);
}
