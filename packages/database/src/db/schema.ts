import { defineRelations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  integer,
  snakeCase,
} from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

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

export const providers = snakeCase.table('providers', {
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
});

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

export const posts = snakeCase.table('posts', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  content: text().notNull(),
  excerpt: varchar({ length: 500 }),
  featuredImageUrl: text(),
  status: postStatusEnum().default('draft').notNull(),
  viewCount: integer().default(0),
  publishedAt: timestamp({ withTimezone: true }),
  authorId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  updatedBy: uuid().references(() => users.id),
  ...timestamps,
});

export const comments = snakeCase.table('comments', {
  id: uuid().primaryKey().defaultRandom(),
  content: text().notNull(),
  postId: uuid()
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  parentId: uuid().references((): any => comments.id),
  ...timestamps,
});

export const categories = snakeCase.table('categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull().unique(),
  slug: varchar({ length: 100 }).notNull().unique(),
  description: varchar({ length: 255 }),
  parentId: uuid().references((): any => categories.id),
  ...timestamps,
});

export const postCategories = snakeCase.table('post_categories', {
  postId: uuid()
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  categoryId: uuid()
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
});

export const relations = defineRelations(
  { users, providers, posts, comments, postCategories, categories },
  (r) => ({
    users: {
      providers: r.many.providers({
        from: r.users.id,
        to: r.providers.userId,
      }),
      posts: r.many.posts({ from: r.users.id, to: r.posts.authorId }),
      comments: r.many.comments({ from: r.users.id, to: r.comments.authorId }),
    },

    providers: {
      user: r.one.users({
        from: r.providers.userId,
        to: r.users.id,
      }),
    },

    posts: {
      author: r.one.users({
        from: r.posts.authorId,
        to: r.users.id,
      }),
      updatedByUser: r.one.users({
        from: r.posts.updatedBy,
        to: r.users.id,
      }),
      comments: r.many.comments({ from: r.posts.id, to: r.comments.postId }),
      categories: r.many.categories({
        from: r.posts.id.through(r.postCategories.postId),
        to: r.categories.id.through(r.postCategories.categoryId),
      }),
    },

    comments: {
      post: r.one.posts({
        from: r.comments.postId,
        to: r.posts.id,
      }),
      author: r.one.users({
        from: r.comments.authorId,
        to: r.users.id,
      }),
      parent: r.one.comments({
        from: r.comments.parentId,
        to: r.comments.id,
      }),
      replies: r.many.comments({
        from: r.comments.id,
        to: r.comments.parentId,
      }),
    },

    categories: {
      parent: r.one.categories({
        from: r.categories.parentId,
        to: r.categories.id,
      }),
      children: r.many.categories({
        from: r.categories.id,
        to: r.categories.parentId,
      }),
      posts: r.many.posts(),
    },
  }),
);
