// @ts-check
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import gitignore from 'eslint-config-flat-gitignore';

/**
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  gitignore(),
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        fathom: 'readonly',
      },

      ecmaVersion: 2020,
      sourceType: 'module',
    },

    rules: {
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-var': 'error',
    },
  },
];

export default config;
