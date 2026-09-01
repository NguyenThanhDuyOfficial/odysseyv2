import { index, snakeCase, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { posts } from './posts';

export const postCategories = snakeCase.table(
  'post_categories',
  {
    postId: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    categoryId: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('post_categories_post_id_idx').on(table.postId),
    index('post_categories_category_id_idx').on(table.categoryId),
    uniqueIndex('uq_post_categories_post_id_category_id_idx').on(
      table.postId,
      table.categoryId,
    ),
  ],
);

export type PostCategory = typeof postCategories.$inferSelect;
export type NewPostCategory = typeof postCategories.$inferInsert;
