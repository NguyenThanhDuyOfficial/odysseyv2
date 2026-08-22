import {
  pgEnum,
  snakeCase,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helper';

export const roleEnum = pgEnum('role', ['user', 'moderator', 'admin']);

export const users = snakeCase.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  displayName: varchar({ length: 255 }),
  email: varchar({ length: 255 }).unique(),
  avatarUrl: text(),
  role: roleEnum().default('user'),
  isActive: boolean().default(true),
  lastLoginAt: timestamp({ withTimezone: true }),
  ...timestamps,
});

export type Role = (typeof roleEnum)['enumValues'][number];
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
