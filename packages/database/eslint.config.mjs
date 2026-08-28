import { libraryConfig } from '@odyssey/eslint-config/library';
import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';

export default defineConfig([
  libraryConfig,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': [
        'error',
        {
          allowList: ['NODE_ENV'],
        },
      ],
    },
  },
]);
