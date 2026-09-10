import {
  AnyPgColumn,
  index,
  snakeCase,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';

export const categories = snakeCase.table(
  'categories',
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 100 }).notNull().unique(),
    slug: varchar({ length: 100 }).notNull().unique(),
    description: varchar({ length: 255 }),
    parentId: uuid().references((): AnyPgColumn => categories.id),
    ...timestamps,
  },
  (table) => [index('categories_parent_id_idx').on(table.parentId)],
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
