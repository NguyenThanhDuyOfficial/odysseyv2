import {
  text,
  varchar,
  timestamp,
  index,
  snakeCase,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { timestamps } from './columns.helper';

export const sessions = snakeCase.table(
  'sessions',
  {
    id: text().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar({ length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at', {
      precision: 6,
      withTimezone: true,
    }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    ...timestamps,
  },
  (table) => [index('sessions_user_id_idx').on(table.userId)],
);

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
