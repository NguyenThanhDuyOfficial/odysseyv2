import {
  snakeCase,
  uuid,
  varchar,
  text,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';
import { users } from './users';
import { sql } from 'drizzle-orm';

export const providers = snakeCase.table(
  'providers',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: varchar({ length: 50 }).notNull(),
    providerId: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    hashedPassword: varchar({ length: 255 }),
    refreshToken: text(),
    tokenExpiresAt: timestamp({ withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index('providers_user_id_idx').on(table.userId),
    index('providers_email_idx').on(table.email),
    uniqueIndex('uq_providers_provider_provider_id')
      .on(table.provider, table.providerId)
      .where(sql`${table.providerId} IS NOT NULL`),
    index('providers_token_expires_at_idx').on(table.tokenExpiresAt),
  ],
);

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;
