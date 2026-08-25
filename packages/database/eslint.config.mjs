import { libraryconfig } from '@odyssey/eslint-config/library';
import { defineconfig } from 'eslint/config';
import tsparser from '@typescript-eslint/parser';

export default defineconfig([
  libraryconfig,
  {
    files: ['src/**/*.ts'],
    languageoptions: {
      parser: tsparser,
      parseroptions: {
        project: true,
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': [
        'error',
        {
          allowlist: ['node_env'],
        },
      ],
    },
  },
]);
