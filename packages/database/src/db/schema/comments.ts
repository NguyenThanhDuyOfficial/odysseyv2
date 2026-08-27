import { snakeCase, uuid, text, AnyPgColumn, index } from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';
import { users } from './users';
import { posts } from './posts';
import { sql } from 'drizzle-orm';

export const comments = snakeCase.table(
  'comments',
  {
    id: uuid().primaryKey().defaultRandom(),
    content: text().notNull(),
    postId: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    authorId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: uuid().references((): AnyPgColumn => comments.id),
    ...timestamps,
  },
  (table) => [
    index('comments_post_id_idx').on(table.postId),
    index('comments_posts_author_id_idx').on(table.authorId),
    index('comments_posts_parent_id_idx').on(table.parentId),
    index('comments_post_id_created_at_idx')
      .on(table.postId, table.createdAt)
      .where(sql`${table.parentId} IS NULL`),
    index('comments_parent_id_created_at_idx').on(
      table.parentId,
      table.createdAt,
    ),
  ],
);

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
