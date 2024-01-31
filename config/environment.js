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
      API_HOST: (process.env.TARGET==='staging') ? 'https://staging-vpc.api.nanowrimo.org' : 'https://api.nanowrimo.org',
      DEBOUNCE_MS: 250,
      SOCIAL_SERVICES: ['facebook', 'twitter', 'instagram', 'medium', 'tumblr', 'youtube'],
      MODAL_BACKGROUND_TRANSITION_MS: 150,
      MODAL_TRANSITION_MS: 300
    },
    emberTracker: {
        analyticsSettings: {
            trackingId: 'G-Q3XHKESGGR',
        },
    },
    
    'ember-cli-uuid': {
      defaultUUID: false
    },

    moment: {
      includeTimezone: 'all'
    },
    'place-autocomplete': {
      exclude: true,
      key: 'AIzaSyDtu-8_FBOLBM4a0kOIPv1p163uHfZ8YG4',
      //client: 'gme-myclientid',
      //version: 3.27, // Optional - if client is set version must be above 3.24
      language: 'en', // Optional - be default will be based on your browser language
      region: 'US' // Optional
    },
    'g-map': {
      libraries: ['places'],
      key: 'AIzaSyDtu-8_FBOLBM4a0kOIPv1p163uHfZ8YG4' //place-autocomplete key
      //key: 'AIzaSyCQPYqd0KcWOgppNEZBEFKQlouY0BKLxss' //the original g-map key
    },
    torii: {
      allowUnsafeRedirect: true,
      providers: {
        'facebook-connect': {
          appId: '766170596906489',
          scope: 'email'
        },
        'custom-google': {
          apiKey: '566453198538-kksub7cjr100rg8a75lmgab1metvnqvc.apps.googleusercontent.com',
          redirectUri: 'http://localhost:4200/oauth2callback',
          scope: 'email profile'
        }
      }
    },

    googleFonts: [
      'Source+Sans+Pro'
    ],

    // Set or update content security policies
    contentSecurityPolicy: {
      'font-src': "'self' fonts.gstatic.com",
      'style-src': "'self' fonts.googleapis.com"
    }
  };
  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'development-docker') {
    ENV.APP.API_HOST = 'http://localhost:3000';
    ENV.APP.UI_HOST = 'http://localhost:4200';
    ENV.forumsUrl = "http://localhost:9292";
  }
  
  if (environment === 'development-local') {
    //console.log(port);
    //ENV.APP.LOG_RESOLVER = true;
    //ENV.APP.LOG_ACTIVE_GENERATION = true;
    //ENV.APP.LOG_TRANSITIONS = true;
    //ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    //ENV.APP.LOG_VIEW_LOOKUPS = true;
    //ENV['ember-cli-mirage'] = { enabled: false };
    //pull in the os lib so we can get the hostname
    var os = require("os");
    //define hosts based on hostname
    if (os.hostname()=='beck.local') {
      ENV.APP.API_HOST = 'http://localhost:3000';
      ENV.APP.UI_HOST = 'http://localhost:4200';
    } else {
      ENV.APP.API_HOST = 'http://'+os.hostname()+':3000';
      ENV.APP.UI_HOST = 'http://'+os.hostname()+':4200';
    }
    //ENV.APP.API_HOST = 'http://localhost:3000';
    //ENV.APP.UI_HOST = 'http://localhost:4200';
    ENV.forumsUrl = "http://localhost:9292";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV.APP.DEBOUNCE_MS = 0;
    ENV.APP.MODAL_BACKGROUND_TRANSITION_MS = 0;
    ENV.APP.MODAL_TRANSITION_MS = 0;
  }

  if (environment === 'production') {
    ENV.torii.providers['facebook-connect'].appId = '2019466444992364';
    ENV.torii.providers['custom-google'].apiKey = '566453198538-khkvh94le8q9a2j0jmrokg8faajotr38.apps.googleusercontent.com';
    ENV.torii.providers['custom-google'].redirectUri = 'https://nanowrimo.org/oauth2callback';
    //the url of the forums
    ENV.forumsUrl = "https://forums.nanowrimo.org";
  }

  //is this a staging target?
  if (process.env.TARGET=='staging' || environment==="dev-with-staging-api") {
    ENV.APP.API_HOST = 'https://staging-vpc.api.nanowrimo.org';
    ENV.torii.providers['custom-google'].redirectUri = 'https://staging-vpc.nanowrimo.org/oauth2callback';
    ENV.forumsUrl = "https://staging.forums.nanowrimo.org";
  }
  
  /*
  // airbrake in development environments only 
  if (environment.includes('development')) {
    ENV.airbrake = {
      projectId: 243512,
      projectKey: '151dc96cad5771144b49301ef01de350',
      keysBlacklist: [
      /password/, // regex match
      /secret/, // regexp match
      /pass/
      ]
    };
    // list of strings that if found in an error, message will prohibit
    // the message from being sent to airbrake
    ENV.airbrake.ignoreMessageStrings=['Ember Data Request','The adapter operation','More context objects'];
  }
  */
  return ENV;
};
