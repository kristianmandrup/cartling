'use strict';

var UsergridError = require('./usergrid_error');

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
    }

};
