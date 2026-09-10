import { db } from '../..';
import {
  postCategories,
  type PostCategory,
  type NewPostCategory,
} from '../schema/postCategories';
import { BaseRepository } from './base.repository';
import { eq, and, sql } from 'drizzle-orm';
import { mapDbError, NotFoundError, AppError } from '@odyssey/error-handling';

export class PostCategoryRepository extends BaseRepository<
  PostCategory,
  NewPostCategory
> {
  protected table = postCategories;
  protected tableName = 'PostCategory';

  async findByPostId(postId: string): Promise<PostCategory[]> {
    try {
      const result = await db
        .select()
        .from(postCategories)
        .where(eq(postCategories.postId, postId));

      return result as PostCategory[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findByCategoryId(categoryId: string): Promise<PostCategory[]> {
    try {
      const result = await db
        .select()
        .from(postCategories)
        .where(eq(postCategories.categoryId, categoryId));

      return result as PostCategory[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findByPostIdWithCategories(postId: string): Promise<string[]> {
    try {
      const result = await db
        .select({ categoryId: postCategories.categoryId })
        .from(postCategories)
        .where(eq(postCategories.postId, postId));

      return result.map((r) => r.categoryId);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async addCategoryToPost(postId: string, categoryId: string): Promise<void> {
    try {
      await db
        .insert(postCategories)
        .values({ postId, categoryId })
        .returning();
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async addCategoriesToPost(
    postId: string,
    categoryIds: string[],
  ): Promise<void> {
    try {
      if (categoryIds.length === 0) return;

      const values = categoryIds.map((categoryId) => ({
        postId,
        categoryId,
      }));

      await db.insert(postCategories).values(values).returning();
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async removeCategoryFromPost(
    postId: string,
    categoryId: string,
  ): Promise<void> {
    try {
      const result = await db
        .delete(postCategories)
        .where(
          and(
            eq(postCategories.postId, postId),
            eq(postCategories.categoryId, categoryId),
          ),
        )
        .returning({ postId: postCategories.postId });

      if (result.length === 0) {
        throw new NotFoundError('PostCategory');
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async removeAllCategoriesFromPost(postId: string): Promise<void> {
    try {
      await db.delete(postCategories).where(eq(postCategories.postId, postId));
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async syncCategoriesForPost(
    postId: string,
    categoryIds: string[],
  ): Promise<void> {
    try {
      await this.removeAllCategoriesFromPost(postId);

      if (categoryIds.length > 0) {
        await this.addCategoriesToPost(postId, categoryIds);
      }
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async getCategoryIdsForPost(postId: string): Promise<string[]> {
    try {
      const result = await db
        .select({ categoryId: postCategories.categoryId })
        .from(postCategories)
        .where(eq(postCategories.postId, postId));

      return result.map((r) => r.categoryId);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async getPostIdsForCategory(categoryId: string): Promise<string[]> {
    try {
      const result = await db
        .select({ postId: postCategories.postId })
        .from(postCategories)
        .where(eq(postCategories.categoryId, categoryId));

      return result.map((r) => r.postId);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async countPostsByCategory(categoryId: string): Promise<number> {
    try {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(postCategories)
        .where(eq(postCategories.categoryId, categoryId));

      return Number(result[0]?.count || 0);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async getCategoriesWithPostCount(): Promise<
    {
      categoryId: string;
      postCount: number;
    }[]
  > {
    try {
      const result = await db
        .select({
          categoryId: postCategories.categoryId,
          postCount: sql<number>`COUNT(*)`,
        })
        .from(postCategories)
        .groupBy(postCategories.categoryId);

      return result;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async deleteByPostId(postId: string): Promise<void> {
    try {
      await db.delete(postCategories).where(eq(postCategories.postId, postId));
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async deleteByCategoryId(categoryId: string): Promise<void> {
    try {
      await db
        .delete(postCategories)
        .where(eq(postCategories.categoryId, categoryId));
    } catch (error) {
      throw mapDbError(error);
    }
  }
}

export const postCategoryRepository = new PostCategoryRepository();
