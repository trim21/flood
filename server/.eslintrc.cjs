const path = require('path');

module.exports = {
  extends: path.resolve(__dirname, '../.eslintrc.cjs'),

  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.test.json'),
  },

  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['**/client/**/*'],
      },
    ],
    'no-restricted-modules': [
      'error',
      {
        patterns: ['**/client/**/*'],
      },
    ],
    // TODO: Explicit return type
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
};
