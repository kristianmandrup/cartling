'use strict';

module.exports = {

  registration: registration,

  app: {
    port: (process.env.PORT || 3000)
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
   specify "file: <filename>" to send output to a file (JSON format)
   or specify "provider: <provider" to change/configure provider
   */
  logger: {
//    provider: winston
//    file: '/Users/sganyo/dev/phrixus/log/phrixus.log'
  },

  /*
   default events provider is pubsub-js (https://github.com/mroderick/PubSubJS)
   specify "sendToLogger: <info>" to send all events to the logger at the specified level (omit to skip)
   specify "provider: <provider>" to change/configure provider
   */
  events: {
    sendToLogger: 'debug'
//    provider: pubsub-js
  },

  oauth: {
    management: require('volos-management-redis'),
    provider: require('volos-oauth-redis')
//    config: { }
  },

  // https://apigee.com/usergrid/#!/getting-started/setup
  usergrid : {
    URI: 'http://localhost:8080',
    orgName: 'test-organization',
    appName: 'test-app',
    clientId: 'YXA6VMWU8KSpEeOFO0UM5I8cuw',
    clientSecret: 'YXA6Z6wLCWs62ahkLFTKV0EWwEmR-HU',
    logging: true,
    buildCurl: true
  },

  /** passport authentication **/

  // https://developers.facebook.com/x/apps/594397020630491/dashboard/
  facebook: {
    clientID: '594397020630491',
    clientSecret: 'aeeeb1bca70ad58865374e6f71ca44e4',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  // https://dev.twitter.com/apps/5739904/show
  twitter: {
    consumerKey: '58inZIKmycVoFG9w8mjsAQ',
    consumerSecret: 'qcspt2YjKYaesFZhCMCO60zH0WvCVreHxax6bZBzQ',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  // https://cloud.google.com/console/project/apps~phrixus-test/apiui/credential
  google: {
    clientID: '1067862380502-4mphdffg8l9rtvncdom5lg9jh6r5iijo.apps.googleusercontent.com',
    clientSecret: 'Fo910QBylLS1gttMeBzNz0il',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  }
};
