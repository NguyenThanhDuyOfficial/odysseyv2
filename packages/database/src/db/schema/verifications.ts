import {
  pgTable,
  text,
  timestamp,
  index,
  snakeCase,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';

export const verifications = snakeCase.table(
  'verifications',
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp('expires_at', {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    ...timestamps,
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export type Verification = typeof verifications.$inferSelect;
export type NewVerificatin = typeof verifications.$inferInsert;
