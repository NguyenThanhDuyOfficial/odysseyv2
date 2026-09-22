import {
  snakeCase,
  varchar,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';
import { users } from './users';
import { sql } from 'drizzle-orm';

export const providers = snakeCase.table(
  'providers',
  {
    id: text().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: text().notNull(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      precision: 6,
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
      precision: 6,
      withTimezone: true,
    }),
    scope: text(),
    idToken: text('id_token'),
    hashedPassword: text('hashed_password'),
    email: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => [
    index('providers_user_id_idx').on(table.userId),
    index('providers_email_idx').on(table.email),
    index('uq_providers_provider_provider_id')
      .on(table.provider, table.providerId)
      .where(sql`${table.providerId} IS NOT NULL`),
  ],
);

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;
