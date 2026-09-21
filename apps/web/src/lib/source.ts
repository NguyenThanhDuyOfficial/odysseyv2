import { defineDocs } from 'fumadocs-mdx/macro';
import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      title: z.string(),
      description: z.string().optional(),
      lastUpdated: z.string().optional(),
      author: z.string().optional(),
    }),
  },
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
