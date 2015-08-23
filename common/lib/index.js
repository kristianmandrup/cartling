'use strict';

export default function(config) {
  return {
    logger: require('./logger')(config),
    events: require('./events')(config),
    util: require('./util'),
    errors: require('./errors')    
  }
};
