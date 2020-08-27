'use strict';

module.exports = {
  globals: {
    server: true,
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
/*<<<<<<< HEAD
    ecmaVersion: 2017,
    sourceType: 'module'
=======*/
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
//>>>>>>> fba111b... v3.12.0...v3.20.0
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
//<<<<<<< HEAD
  rules: {
    "ember/no-observers":1,
    "ember/no-new-mixins":1,
    "ember/require-return-from-computed":1
  },
//=======
//  rules: {},
//>>>>>>> fba111b... v3.12.0...v3.20.0
  overrides: [
    // node files
    {
      files: [
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
//<<<<<<< HEAD
//=======
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
      rules: {
        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off'
//>>>>>>> fba111b... v3.12.0...v3.20.0
      }
    }
  ]
};
