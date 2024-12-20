const skuba = require('eslint-config-skuba');

module.exports = [
  {
    ignores: ['**/cdk.out/'],
  },
  ...skuba,
  {
    rules: {
      'jest/consistent-test-it': [
        'error',
        {
          fn: 'it',
        },
      ],
    },
  },
  {
    files: ['bootstrap/**/*.js'],

    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-console': 'off',
      'no-sync': 'off',
    },
  },
];
