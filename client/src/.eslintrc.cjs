const path = require('path');

module.exports = {
  extends: ['react-app', 'airbnb-typescript', 'plugin:@typescript-eslint/recommended', 'prettier'],

  parserOptions: {
    project: path.resolve(__dirname, '../tsconfig.json'),
  },

  env: {
    browser: true,
    node: false,
  },

  globals: {
    global: 'writable',
    process: 'writable',
    window: 'writable',
  },

  rules: {
    "import/no-anonymous-default-export": 0,
    'import/no-extraneous-dependencies': 0,
    'no-restricted-imports': [
      'error',
      {
        patterns: ['**/config', '**/server/**/*'],
      },
    ],
    'no-restricted-modules': [
      'error',
      {
        patterns: ['**/config', '**/server/**/*'],
      },
    ],
    'no-console': [2, {allow: ['warn', 'error']}],
    'no-underscore-dangle': [2, {allow: ['_id']}],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'react/static-property-placement': [2, 'static public field'],
    '@typescript-eslint/lines-between-class-members': ['error', 'always', {exceptAfterSingleLine: true}],
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.resolve(__dirname, '../config/webpack.config.dev.js'),
      },
    },
  },
};
