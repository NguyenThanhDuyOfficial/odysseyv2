import { defineRelations } from 'drizzle-orm';
import { users } from './schema/users';
import { providers } from './schema/providers';
import { posts } from './schema/posts';
import { comments } from './schema/comments';
import { postCategories } from './schema/postCategories';
import { categories } from './schema/categories';

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
