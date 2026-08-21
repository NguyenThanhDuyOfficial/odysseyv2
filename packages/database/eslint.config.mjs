import { libraryConfig } from '@odyssey/eslint-config/library';
import tsParser from '@typescript-eslint/parser';

export default {
  extends: [libraryConfig],

  parser: tsParser,
  parserOptions: {
    project: true,
  },
  rules: {
    'turbo/no-undeclared-env-vars': [
      'error',
      {
        allowList: ['NODE_ENV'],
      },
    ],
  },
};
