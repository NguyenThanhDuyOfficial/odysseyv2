import {
  snakeCase,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';
import { users } from './users';
import { index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

export const posts = snakeCase.table(
  'posts',
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    content: text().notNull(),
    excerpt: varchar({ length: 500 }),
    featuredImageUrl: text(),
    status: postStatusEnum().default('draft').notNull(),
    viewCount: integer().default(0),
    voteCount: integer().default(0),
    publishedAt: timestamp({ withTimezone: true }),
    authorId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    updatedBy: text().references(() => users.id),
    ...timestamps,
  },
  (table) => [
    index('posts_view_count_idx').on(table.viewCount),
    index('posts_vote_count_idx').on(table.voteCount),
    index('posts_author_id_idx').on(table.authorId),
    index('posts_updated_by_idx').on(table.updatedBy),
    index('posts_status_idx').on(table.status),
    index('posts_status_published_at_idx')
      .on(table.status, table.publishedAt)
      .where(sql`${table.status} = 'published'`),
    index('posts_author_status_idx').on(table.authorId, table.status),
  ],
);

export type PostStatus = (typeof postStatusEnum)['enumValues'][number];
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
