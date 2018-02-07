'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'nanowrimo',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      API_HOST: 'https://api.nanowrimo.org'
    },

    moment: {
      includeTimezone: 'all'
    },

    torii: {
      allowUnsafeRedirect: true,
      providers: {
        'facebook-connect': {
          appId: '766170596906489',
          scope: 'email'
        },
        'google-oauth2-bearer-v2': {
          apiKey: '566453198538-kksub7cjr100rg8a75lmgab1metvnqvc.apps.googleusercontent.com',
          redirectUri: 'http://localhost:4200/oauth2callback',
          scope: 'email profile'
        }
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.torii.providers['facebook-connect'].appId = '2019466444992364';
    ENV.torii.providers['google-oauth2-bearer-v2'].apiKey = '566453198538-khkvh94le8q9a2j0jmrokg8faajotr38.apps.googleusercontent.com';
    ENV.torii.providers['google-oauth2-bearer-v2'].redirectUri = 'http://ember.nanowrimo.org/oauth2callback';
  }

  return ENV;
};
