import { db } from '../..';
import {
  categories,
  type Category,
  type NewCategory,
} from '../schema/categories';
import { BaseRepository } from './base.repository';
import { eq, desc, asc, sql, isNull, and, SQL, AnyColumn } from 'drizzle-orm';
import {
  mapDbError,
  NotFoundError,
  ConflictError,
  AppError,
} from '@odyssey/error-handling';

export class CategoryRepository extends BaseRepository<Category, NewCategory> {
  protected table = categories;
  protected tableName = 'Category';

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findByName(name: string): Promise<Category | null> {
    try {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1);

      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findRoots(): Promise<Category[]> {
    try {
      const result = await db
        .select()
        .from(categories)
        .where(isNull(categories.parentId))
        .orderBy(asc(categories.name));

      return result as Category[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findChildren(parentId: string): Promise<Category[]> {
    try {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.parentId, parentId))
        .orderBy(asc(categories.name));

      return result as Category[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findTree(): Promise<CategoryWithChildren[]> {
    try {
      const all = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.name));

      const map = new Map<string, CategoryWithChildren>();
      const roots: CategoryWithChildren[] = [];

      all.forEach((cat) => {
        const node: CategoryWithChildren = { ...cat, children: [] };
        map.set(cat.id, node);

        if (cat.parentId === null) {
          roots.push(node);
        }
      });

      all.forEach((cat) => {
        if (cat.parentId !== null) {
          const parent = map.get(cat.parentId);
          if (parent) {
            parent.children.push(map.get(cat.id)!);
          }
        }
      });

      return roots;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findMany({
    page = 1,
    limit = 10,
    search,
    parentId,
    sortBy = 'name',
    sortOrder = 'asc',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string | null;
    sortBy?: keyof Category;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const conditions: SQL<unknown>[] = [];

      if (search) {
        conditions.push(
          sql`${categories.name} ILIKE ${`%${search}%`} OR ${categories.description} ILIKE ${`%${search}%`}`,
        );
      }

      if (parentId !== undefined) {
        if (parentId === null) {
          conditions.push(isNull(categories.parentId));
        } else {
          conditions.push(eq(categories.parentId, parentId));
        }
      }

      const where = conditions.length ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(categories)
        .where(where)
        .orderBy(
          sortOrder === 'desc'
            ? desc(categories[sortBy as keyof typeof categories] as AnyColumn)
            : asc(categories[sortBy as keyof typeof categories] as AnyColumn),
        )
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(categories)
        .where(where);

      const total = Number(totalResult[0]?.count || 0);

      return {
        data: result as Category[],
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

  async create(data: NewCategory): Promise<Category> {
    try {
      if (!data.slug && data.name) {
        data.slug = this.generateSlug(data.name);
      }

      if (data.slug) {
        const existing = await this.findBySlug(data.slug);
        if (existing) {
          throw new ConflictError('Slug already exists');
        }
      }

      if (data.name) {
        const existing = await this.findByName(data.name);
        if (existing) {
          throw new ConflictError('Category name already exists');
        }
      }

      if (data.parentId) {
        const parent = await this.findById(data.parentId);
        if (!parent) {
          throw new NotFoundError('Parent category');
        }
      }

      const result = await db.insert(categories).values(data).returning();

      const category = result[0];
      if (!category) {
        throw new AppError('Failed to create category', 500, 'CREATE_FAILED');
      }

      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async update(id: string, data: Partial<NewCategory>): Promise<Category> {
    try {
      if (data.slug) {
        const existing = await this.findBySlug(data.slug);
        if (existing && existing.id !== id) {
          throw new ConflictError('Slug already taken');
        }
      }

      if (data.name) {
        const existing = await this.findByName(data.name);
        if (existing && existing.id !== id) {
          throw new ConflictError('Category name already taken');
        }
      }

      if (data.parentId) {
        if (data.parentId === id) {
          throw new ConflictError('Category cannot be its own parent');
        }

        const parent = await this.findById(data.parentId);
        if (!parent) {
          throw new NotFoundError('Parent category');
        }

        const children = await this.findChildren(id);
        if (children.some((c) => c.id === data.parentId)) {
          throw new ConflictError('Cannot set parent to a child category');
        }
      }

      const result = await db
        .update(categories)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, id))
        .returning();

      const category = result[0];
      if (!category) {
        throw new NotFoundError(this.tableName);
      }

      return category;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const children = await this.findChildren(id);
      if (children.length > 0) {
        throw new ConflictError('Cannot delete category with children');
      }

      const result = await db
        .delete(categories)
        .where(eq(categories.id, id))
        .returning({ id: categories.id });

      if (result.length === 0) {
        throw new NotFoundError(this.tableName);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
};

export type CategoryWithPostCount = Category & {
  postCount: number;
};

export const categoryRepository = new CategoryRepository();
