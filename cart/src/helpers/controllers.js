'use strict';

var log = require('./common').logger;

module.exports = {

  onSuccess:
    function(err, req, res, reply, next) {
      if (err) {
        if (err.isValidationErrors()) {
          log.error(JSON.stringify(err));
          res.json(400, err);
        } else {
          log.error(err.stack);
          res.json(500, err); // todo: more error handling
        }
      }
      next(res, reply);
    }
};
