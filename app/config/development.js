'use strict';

module.exports = {

  app: {
    port: (process.env.PORT || 3000)
  },

  // https://apigee.com/usergrid/#!/getting-started/setup
  usergrid : {
    URI: 'https://api.usergrid.com',
    orgName: 'sganyo',
    appName: 'phrixus-test',
    clientId: 'YXA6V2s-IIlNEeOv2WMm48WQtA',
    clientSecret: 'YXA6TX4UyHiBnNUGxmm8R-PxeAVkWsA',
    logging: true,
    buildCurl: true
  },
//  usergrid : {
//    URI: 'http://localhost:8080',
//    orgName: 'test-organization',
//    appName: 'test-app',
//    clientId: 'b3U67BsntKrXEeODXxMF4YH_TQ',
//    clientSecret: 'b3U67cV8JmSkaM5gji5Z8xb7Hr8SrNc',
//    logging: true,
//    buildCurl: true
//  },

  passport: {
    // https://developers.facebook.com/x/apps/594397020630491/dashboard/
    facebook: {
      clientID: '594397020630491',
      clientSecret: 'aeeeb1bca70ad58865374e6f71ca44e4',
      callbackURL: '/auth/facebook/callback'
    },

    // https://dev.twitter.com/apps/5739904/show
//    twitter: {
//      consumerKey: '58inZIKmycVoFG9w8mjsAQ',
//      consumerSecret: 'qcspt2YjKYaesFZhCMCO60zH0WvCVreHxax6bZBzQ',
//      callbackURL: '/auth/twitter/callback'
//    },

    // https://cloud.google.com/console/project/apps~phrixus-test/apiui/credential
    google: {
      clientID: '1067862380502-4mphdffg8l9rtvncdom5lg9jh6r5iijo.apps.googleusercontent.com',
      clientSecret: 'Fo910QBylLS1gttMeBzNz0il',
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
    level: 'debug',
    file: {
      name: 'phrixus.log',
      level: 'debug'
    }
  },

  /*
   default events provider is pubsub-js (https://github.com/mroderick/PubSubJS)
   specify "sendToLogger: <info>" to send all events to the logger at the specified level (omit to skip)
   specify "provider: <provider>" to set provider (javascript object)
   */
  events: {
    sendToLogger: 'debug'
  },

  oauth: {
    config: { encryptionKey: 'This is my secret key' },
    management: require('volos-management-redis'),
    provider: require('volos-oauth-redis')
  },

  register: {
    developer: {
      firstName: 'Phrixus',
      lastName: 'Developer',
      email: 'phrixus@developer.com',
      userName: 'phrixus'
    },
    application: {
      name: 'Phrixus',
      scopes: 'user cart mycart'
    },
    user: {
      username: 'default',
      password: 'password'
    }
  }
};

