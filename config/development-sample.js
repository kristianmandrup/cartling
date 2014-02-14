/*
  Copy this file to "development.js" and replace the ALL_CAPS items with your personalized configuration.
 */
'use strict';

module.exports = {

  app: {
    port: process.env.PORT || 3000
  },

  /*
   default logger is winston (https://github.com/flatiron/winston)
   by default, logs to console w/ coloring
   specify "file: <filename>" to send output to a file (JSON format)
   or specify "provider: <provider" to change/configure provider
   */
  logger: {
//    file: '/var/log/phrixus.log'
  },

  /*
   default events provider is pubsub-js (https://github.com/mroderick/PubSubJS)
   specify "sendToLogger: <info>" to send all events to the logger at the specified level (omit to skip)
   specify "provider: <provider" to change/configure provider
   */
  events: {
    sendToLogger: 'debug'
  },

  oauth: require('volos-oauth-redis'),

  // https://apigee.com/usergrid/#!/getting-started/setup
  usergrid : {
    url: 'https://api.usergrid.com',
    orgName: 'ORGANIZATION',
    appName: 'APPLICATION',
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    logging: false,
    buildCurl: false
  }
};
