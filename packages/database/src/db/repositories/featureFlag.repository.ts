import { db } from '../..';
import {
  featureFlags,
  type FeatureFlag,
  type NewFeatureFlag,
} from '../schema/featureFlags';
import { BaseRepository } from './base.repository';
import { eq, and, isNull, isNotNull, sql, SQL } from 'drizzle-orm';
import {
  mapDbError,
  NotFoundError,
  ConflictError,
  AppError,
} from '@odyssey/error-handling';

export class FeatureFlagRepository extends BaseRepository<
  FeatureFlag,
  NewFeatureFlag
> {
  protected table = featureFlags;
  protected tableName = 'FeatureFlag';

  async findByKey(key: string): Promise<FeatureFlag | null> {
    try {
      const result = await db
        .select()
        .from(featureFlags)
        .where(and(eq(featureFlags.key, key), isNull(featureFlags.deletedAt)))
        .limit(1);

      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findEnabled(): Promise<FeatureFlag[]> {
    try {
      const result = await db
        .select()
        .from(featureFlags)
        .where(
          and(eq(featureFlags.enabled, true), isNull(featureFlags.deletedAt)),
        )
        .orderBy(featureFlags.name);

      return result as FeatureFlag[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async isEnabled(key: string): Promise<boolean> {
    try {
      const flag = await this.findByKey(key);
      return flag?.enabled || false;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findMany({
    page = 1,
    limit = 10,
    search,
    enabled,
    includeDeleted = false,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    enabled?: boolean;
    includeDeleted?: boolean;
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const conditions: SQL<unknown>[] = [];

      if (!includeDeleted) {
        conditions.push(isNull(featureFlags.deletedAt));
      }

      if (search) {
        conditions.push(
          sql`${featureFlags.key} ILIKE ${`%${search}%`} OR ${featureFlags.name} ILIKE ${`%${search}%`}`,
        );
      }

      if (enabled !== undefined) {
        conditions.push(eq(featureFlags.enabled, enabled));
      }

      const where = conditions.length ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(featureFlags)
        .where(where)
        .orderBy(featureFlags.createdAt)
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(featureFlags)
        .where(where);

      const total = Number(totalResult[0]?.count || 0);

      return {
        data: result as FeatureFlag[],
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

  async create(data: NewFeatureFlag): Promise<FeatureFlag> {
    try {
      if (!data.key) {
        throw new AppError(
          'Feature flag key is required',
          400,
          'VALIDATION_ERROR',
        );
      }

      const existing = await this.findByKey(data.key);
      if (existing) {
        throw new ConflictError(
          `Feature flag with key "${data.key}" already exists`,
        );
      }

      const result = await db.insert(featureFlags).values(data).returning();

      const flag = result[0];
      if (!flag) {
        throw new AppError(
          'Failed to create feature flag',
          500,
          'CREATE_FAILED',
        );
      }

      return flag;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async update(
    id: string,
    data: Partial<NewFeatureFlag>,
  ): Promise<FeatureFlag> {
    try {
      if (data.key) {
        const existing = await this.findByKey(data.key);
        if (existing && existing.id !== id) {
          throw new ConflictError(
            `Feature flag with key "${data.key}" already exists`,
          );
        }
      }

      const result = await db
        .update(featureFlags)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(and(eq(featureFlags.id, id), isNull(featureFlags.deletedAt)))
        .returning();

      const flag = result[0];
      if (!flag) {
        throw new NotFoundError(this.tableName);
      }

      return flag;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async enable(id: string, updatedBy?: string): Promise<FeatureFlag> {
    return this.update(id, {
      enabled: true,
      updatedBy,
    });
  }

  async disable(id: string, updatedBy?: string): Promise<FeatureFlag> {
    return this.update(id, {
      enabled: false,
      updatedBy,
    });
  }

  async toggle(id: string, updatedBy?: string): Promise<FeatureFlag> {
    const flag = await this.findById(id);
    if (!flag) {
      throw new NotFoundError(this.tableName);
    }

    return this.update(id, {
      enabled: !flag.enabled,
      updatedBy,
    });
  }

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    try {
      const result = await db
        .update(featureFlags)
        .set({
          deletedAt: new Date(),
          deletedBy,
          updatedAt: new Date(),
        })
        .where(and(eq(featureFlags.id, id), isNull(featureFlags.deletedAt)))
        .returning({ id: featureFlags.id });

      if (result.length === 0) {
        throw new NotFoundError(this.tableName);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async restore(id: string): Promise<void> {
    try {
      const result = await db
        .update(featureFlags)
        .set({
          deletedAt: null,
          deletedBy: null,
          updatedAt: new Date(),
        })
        .where(and(eq(featureFlags.id, id), isNotNull(featureFlags.deletedAt)))
        .returning({ id: featureFlags.id });

      if (result.length === 0) {
        throw new NotFoundError(this.tableName);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw mapDbError(error);
    }
  }

  async getEnabledKeys(): Promise<string[]> {
    try {
      const result = await db
        .select({ key: featureFlags.key })
        .from(featureFlags)
        .where(
          and(eq(featureFlags.enabled, true), isNull(featureFlags.deletedAt)),
        );

      return result.map((r) => r.key);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async getFlagsByKeys(keys: string[]): Promise<FeatureFlag[]> {
    try {
      if (keys.length === 0) return [];

      const result = await db
        .select()
        .from(featureFlags)
        .where(
          and(
            sql`${featureFlags.key} IN (${keys.join(',')})`,
            isNull(featureFlags.deletedAt),
          ),
        );

      return result as FeatureFlag[];
    } catch (error) {
      throw mapDbError(error);
    }
  }
}

export const featureFlagRepository = new FeatureFlagRepository();
