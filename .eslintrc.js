'use strict';

module.exports = {
  globals: {
    server: true,
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    "ember/no-observers":1,
    "ember/no-new-mixins":1,
    "ember/require-return-from-computed":1,
    'ember/no-jquery': 1,
    'ember/no-get':1,
    'ember/no-mixins':1,
    'ember/use-ember-data-rfc-395-imports':1,
    'ember/require-computed-property-dependencies':1,
    'ember/require-computed-macros':1,
    'ember/no-invalid-dependent-keys':1,
    "no-console": 2,
    "no-debugger": 2
    
  },
  overrides: [
    // node files
    {
      files: [
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'config/**/*.js',
        'lib/*/index.js',
        '.eslintrc.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true

      }
    }
  ]
};
