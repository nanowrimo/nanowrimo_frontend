module.exports = {
  globals: {
    server: true,
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> parent of 524f4af... Commented out merge conflict
  rules: {
    "ember/no-observers":1,
    "ember/no-new-mixins":1,
    "ember/require-return-from-computed":1
  },
<<<<<<< HEAD
=======
=======
  rules: {},
>>>>>>> fba111b... v3.12.0...v3.20.0
>>>>>>> parent of 524f4af... Commented out merge conflict
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
      rules: {
        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off'
>>>>>>> fba111b... v3.12.0...v3.20.0
>>>>>>> parent of 524f4af... Commented out merge conflict
      }
    }
  ]
};
