import {
  pgEnum,
  snakeCase,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';

export const roleEnum = pgEnum('role', ['user', 'moderator', 'admin']);

export const users = snakeCase.table('users', {
  id: text().primaryKey(),
  username: text().notNull(),
  email: varchar({ length: 255 }).unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  avatarUrl: text('avatar_url'),
  display_name: varchar({ length: 255 }),
  role: roleEnum().default('user'),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  ...timestamps,
});

export type Role = (typeof roleEnum)['enumValues'][number];
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
