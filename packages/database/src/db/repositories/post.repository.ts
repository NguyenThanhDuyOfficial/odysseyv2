import { db } from '../..';
import {
  posts,
  type Post,
  type NewPost,
  type PostStatus,
} from '../schema/posts';
import { BaseRepository } from './base.repository';
import { eq, and, desc, asc, sql, SQL, AnyColumn } from 'drizzle-orm';
import { mapDbError } from '@odyssey/error-handling';

export class PostRepository extends BaseRepository<Post, NewPost> {
  protected table = posts;
  protected tableName = 'Post';

  async findBySlug(slug: string): Promise<Post | null> {
    try {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    try {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.authorId, authorId))
        .orderBy(desc(posts.createdAt));

      return result as Post[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findMany({
    page = 1,
    limit = 10,
    search,
    status,
    authorId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    authorId?: string;
    sortBy?: keyof Post;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const conditions: SQL<unknown>[] = [];

      if (search) {
        conditions.push(
          sql`${posts.title} ILIKE ${`%${search}%`} OR ${posts.content} ILIKE ${`%${search}%`}`,
        );
      }

      if (status) {
        conditions.push(eq(posts.status, status as PostStatus));
      }

      if (authorId) {
        conditions.push(eq(posts.authorId, authorId));
      }

      const where = conditions.length ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(posts)
        .where(where)
        .orderBy(
          sortOrder === 'desc'
            ? desc(posts[sortBy as keyof typeof posts] as AnyColumn)
            : asc(posts[sortBy as keyof typeof posts] as AnyColumn),
        )
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(posts)
        .where(where);

      const total = Number(totalResult[0]?.count || 0);

      return {
        data: result as Post[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findManyWithStats({
    page = 1,
    limit = 10,
    search,
    status,
    authorId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    authorId?: string;
    sortBy?: keyof Post;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const conditions: SQL<unknown>[] = [];

      if (search) {
        conditions.push(
          sql`${posts.title} ILIKE ${`%${search}%`} OR ${posts.content} ILIKE ${`%${search}%`}`,
        );
      }

      if (status) {
        conditions.push(eq(posts.status, status as PostStatus));
      }

      if (authorId) {
        conditions.push(eq(posts.authorId, authorId));
      }

      const where = conditions.length ? and(...conditions) : undefined;

      const result = await db
        .select({})
        .from(posts)
        .where(where)
        .orderBy(
          sortOrder === 'desc'
            ? desc(posts[sortBy as keyof typeof posts] as AnyColumn)
            : asc(posts[sortBy as keyof typeof posts] as AnyColumn),
        )
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(posts)
        .where(where);

      const total = Number(totalResult[0]?.count || 0);

      return {
        data: result as Post[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw mapDbError(error);
    }
  }
}

export const postRepository = new PostRepository();
