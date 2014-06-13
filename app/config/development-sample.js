/*
 1) Be sure you've run bin/register.
 2) Copy this file to config/development.js.
 3) Then, edit the CAPITALIZED attributes below (see the usergrid section).
 */
'use strict';

// Copy this file to config/development.js, config/test.js, or config/production.js as needed for your environments.
// ** The usergrid section is REQUIRED. **
// The passport section is required in order to use the client Facebook and Google login buttons.

module.exports = {

  app: {
    // note: if you change the port, you must change the port in phrixus/client/js/app.js
    port: (process.env.PORT || 3000)
  },

  // !! you MUST set url, orgName, appName, clientId, and clientSecret !!
  // https://apigee.com/usergrid/#!/getting-started/setup
  usergrid : {
    url: 'https://api.usergrid.com',
    orgName: 'ORGANIZATION',
    appName: 'APPLICATION',
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    logging: false,
    buildCurl: false
  },

  // !! if passport is not configured, the Facebook and Google login buttons in the web client will not work !!
  passport: {
    // see: https://developers.facebook.com/apps/
    facebook: {
      clientID: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET',
      callbackURL: '/auth/facebook/callback'
    },

    // see: https://console.developers.google.com/project
    google: {
      clientID: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET',
      callbackURL: '/auth/google/callback'
    }
  },

  /*
   automatically reaps any users marked as "guest" when their time is up
   frequency: how often (in ms) to attempt the reaping (default: 3600000 (one hour))
   age: how old a User can live (time since last modified) (default: 86400000 (one day))
   set frequency or age to 0 to disable Carrousel
   */
  guestUserReaper: {
    frequency: 3600000,
    age: 86400000
  },

  /*
   default logger is winston (https://github.com/flatiron/winston)
   by default, logs to console w/ coloring
   specify "provider: <provider>" to set a custom provider (javascript object)
     (if this is done, it is assumed to be configured and all other configuration will be skipped)
   otherwise, you may specify:
     "level: <level>" to set the baseline level for console and file output
     "file: { name: <filename>, level: <level> }" to send output to a file (JSON format)
   */
  logger: {
    level: 'debug'
//    file: {
//      name: '/var/log/phrixus.log',
//      level: 'info'
//    }
  },

  /*
   default events provider is pubsub-js (https://github.com/mroderick/PubSubJS)
   specify "sendToLogger: <info>" to send all events to the logger at the specified level (omit to skip logging)
   specify "provider: <provider>" to set a provider (javascript object)
   */
  events: {
    sendToLogger: 'debug'
  },

  /*
   default provider is redis, but you could use any volos provider (eg. apigee)
   */
  oauth: {
    config: { encryptionKey: 'This is my secret key' },
    management: require('volos-management-redis'),
    provider: require('volos-oauth-redis')
  },

  /*
   Set to custom values to control the create actions of the bin/register script.
   */
  register: {
    developer: {
      firstName: 'Phrixus',
      lastName: 'Developer',
      email: 'phrixus@developer.com',
      userName: 'phrixus'
    },
    application: {
      name: 'Phrixus'
    },
    user: {
      username: 'default',
      password: 'password'
    }
  }
};
