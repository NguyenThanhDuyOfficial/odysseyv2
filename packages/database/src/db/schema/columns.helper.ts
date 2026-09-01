import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('created_at', {
    precision: 6,
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp('updated_at', {
    precision: 6,
    withTimezone: true,
  }).notNull(),
};
