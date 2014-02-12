/*
  Copy this file to "development.js" and replace the ALL_CAPS items with your personalized configuration.
 */
'use strict';

module.exports = {

  app: {
    port: process.env.PORT || 3000
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
