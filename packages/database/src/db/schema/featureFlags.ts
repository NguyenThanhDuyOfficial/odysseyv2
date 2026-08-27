import {
  snakeCase,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';
import { users } from './users';
import { sql } from 'drizzle-orm';

export const featureFlags = snakeCase.table(
  'feature_flags',
  {
    id: uuid().primaryKey().defaultRandom(),
    key: varchar({ length: 100 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    enabled: boolean().default(false).notNull(),
    createdBy: text().references(() => users.id, {
      onDelete: 'set null',
    }),
    updatedBy: text().references(() => users.id, {
      onDelete: 'set null',
    }),
    deletedBy: text().references(() => users.id, {
      onDelete: 'set null',
    }),
    deletedAt: timestamp({
      withTimezone: true,
    }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('feature_flags_key')
      .on(table.key)
      .where(sql`${table.deletedAt} IS NULL`),
    index('idx_feature_flags_enabled_key')
      .on(table.enabled, table.key)
      .where(sql`${table.deletedAt} IS NULL`),
    index('feature_flags_created_by_idx')
      .on(table.createdBy)
      .where(sql`${table.deletedAt} IS NULL`),
    index('feature_flags_deleted_at_idx')
      .on(table.deletedAt)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type NewFeatureFlag = typeof featureFlags.$inferInsert;
