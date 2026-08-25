import { db } from '../..';
import { comments, type Comment, type NewComment } from '../schema/comments';
import { BaseRepository } from './base.repository';
import { eq, and, desc, asc, sql, isNull, inArray } from 'drizzle-orm';
import {
  mapDbError,
  NotFoundError,
  ValidationError,
  AppError,
} from '@odyssey/error-handling';

export class CommentRepository extends BaseRepository<Comment, NewComment> {
  protected table = comments;
  protected tableName = 'Comment';

  async findByPostId(
    postId: string,
    {
      page = 1,
      limit = 10,
      sortOrder = 'desc',
    }: {
      page?: number;
      limit?: number;
      sortOrder?: 'asc' | 'desc';
    } = {},
  ): Promise<{
    data: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const offset = (page - 1) * limit;

      const result = await db
        .select()
        .from(comments)
        .where(and(eq(comments.postId, postId), isNull(comments.parentId)))
        .orderBy(
          sortOrder === 'desc'
            ? desc(comments.createdAt)
            : asc(comments.createdAt),
        )
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(comments)
        .where(and(eq(comments.postId, postId), isNull(comments.parentId)));

      const total = Number(totalResult[0]?.count || 0);

      return {
        data: result as Comment[],
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

  async findReplies(
    commentId: string,
    {
      page = 1,
      limit = 10,
      sortOrder = 'asc',
    }: {
      page?: number;
      limit?: number;
      sortOrder?: 'asc' | 'desc';
    } = {},
  ): Promise<{
    data: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const offset = (page - 1) * limit;

      const result = await db
        .select()
        .from(comments)
        .where(eq(comments.parentId, commentId))
        .orderBy(
          sortOrder === 'desc'
            ? desc(comments.createdAt)
            : asc(comments.createdAt),
        )
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(comments)
        .where(eq(comments.parentId, commentId));

      const total = Number(totalResult[0]?.count || 0);

      return {
        data: result as Comment[],
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

  async findByAuthorId(authorId: string): Promise<Comment[]> {
    try {
      const result = await db
        .select()
        .from(comments)
        .where(eq(comments.authorId, authorId))
        .orderBy(desc(comments.createdAt));

      return result as Comment[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findWithReplies(postId: string): Promise<CommentWithReplies[]> {
    try {
      const allComments = await db
        .select()
        .from(comments)
        .where(eq(comments.postId, postId))
        .orderBy(asc(comments.createdAt));

      const commentMap = new Map<string, CommentWithReplies>();
      const rootComments: CommentWithReplies[] = [];

      allComments.forEach((comment) => {
        const commentWithReplies: CommentWithReplies = {
          ...comment,
          replies: [],
        };
        commentMap.set(comment.id, commentWithReplies);

        if (comment.parentId === null) {
          rootComments.push(commentWithReplies);
        }
      });

      allComments.forEach((comment) => {
        if (comment.parentId !== null) {
          const parent = commentMap.get(comment.parentId);
          if (parent) {
            parent.replies.push(commentMap.get(comment.id)!);
          }
        }
      });

      return rootComments;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async countByPostId(postId: string): Promise<number> {
    try {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(comments)
        .where(eq(comments.postId, postId));

      return Number(result[0]?.count || 0);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async countReplies(commentId: string): Promise<number> {
    try {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(comments)
        .where(eq(comments.parentId, commentId));

      return Number(result[0]?.count || 0);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async countByAuthor(authorId: string): Promise<number> {
    try {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(comments)
        .where(eq(comments.authorId, authorId));

      return Number(result[0]?.count || 0);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async create(data: NewComment): Promise<Comment> {
    try {
      if (!data.content || data.content.trim().length === 0) {
        throw new ValidationError('Comment content is required');
      }

      if (data.parentId) {
        const parent = await this.findById(data.parentId);
        if (!parent) {
          throw new NotFoundError('Parent comment');
        }
        if (parent.postId !== data.postId) {
          throw new ValidationError(
            'Parent comment does not belong to this post',
          );
        }
      }

      const result = await db
        .insert(comments)
        .values({
          ...data,
          content: data.content.trim(),
        })
        .returning();

      const comment = result[0];
      if (!comment) {
        throw new AppError('Failed to create comment', 500, 'CREATE_FAILED');
      }

      return comment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async deleteWithReplies(id: string): Promise<void> {
    try {
      const replies = await db
        .select({ id: comments.id })
        .from(comments)
        .where(eq(comments.parentId, id));

      const replyIds = replies.map((r) => r.id);

      if (replyIds.length > 0) {
        await db.delete(comments).where(inArray(comments.id, replyIds));
      }

      const result = await db
        .delete(comments)
        .where(eq(comments.id, id))
        .returning({ id: comments.id });

      if (result.length === 0) {
        throw new NotFoundError(this.tableName);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async findRootComment(commentId: string): Promise<Comment | null> {
    try {
      const comment = await this.findById(commentId);
      if (!comment) return null;

      // Nếu comment là reply, tìm parent
      if (comment.parentId) {
        let parent = await this.findById(comment.parentId);
        while (parent && parent.parentId) {
          parent = await this.findById(parent.parentId);
        }
        return parent;
      }

      return comment;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async isAuthor(commentId: string, userId: string): Promise<boolean> {
    try {
      const comment = await this.findById(commentId);
      if (!comment) return false;
      return comment.authorId === userId;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async getRecent(limit: number = 10): Promise<Comment[]> {
    try {
      const result = await db
        .select()
        .from(comments)
        .orderBy(desc(comments.createdAt))
        .limit(limit);

      return result as Comment[];
    } catch (error) {
      throw mapDbError(error);
    }
  }
}

export type CommentWithReplies = Comment & {
  replies: CommentWithReplies[];
};

export const commentRepository = new CommentRepository();
