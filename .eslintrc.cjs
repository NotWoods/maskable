// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    impliedStrict: true,
  },
  ignorePatterns: ['**/*.d.ts', '**/*-bundle.js', 'web_modules/**/*'],
  rules: {
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'no-else-return': 'off',
    'no-inner-declarations': 'off',
    'no-var': 'error',
  },
};

module.exports = config;
