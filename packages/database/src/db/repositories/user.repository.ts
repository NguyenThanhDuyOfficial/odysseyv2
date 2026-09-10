import { NewUser, Role, User, users } from '../schema/users';
import { db } from '../..';
import { BaseRepository } from './base.repository';
import {
  eq,
  ilike,
  or,
  desc,
  asc,
  sql,
  and,
  SQL,
  AnyColumn,
} from 'drizzle-orm';
import { mapDbError } from '@odyssey/error-handling';

export class UserRepository extends BaseRepository<User, NewUser> {
  protected table = users;
  protected tableName = 'User';

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findMany({
    page = 1,
    limit = 10,
    search,
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    sortBy?: keyof User;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const conditions: SQL<unknown>[] = [];

      if (search) {
        conditions.push(
          or(
            ilike(users.username, `%${search}%`),
            ilike(users.displayName, `%${search}%`),
            ilike(users.email, `%${search}%`),
          ) as SQL<unknown>,
        );
      }

      if (role) {
        conditions.push(eq(users.role, role as Role));
      }

      if (isActive !== undefined) {
        conditions.push(eq(users.isActive, isActive));
      }

      const where = conditions.length ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(users)
        .where(where)
        .orderBy(
          sortOrder === 'desc'
            ? desc(users[sortBy as keyof typeof users] as AnyColumn)
            : asc(users[sortBy as keyof typeof users] as AnyColumn),
        )
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(users)
        .where(where);

      const total = Number(totalResult[0]?.count || 0);

      return {
        data: result as User[],
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

export const userRepository = new UserRepository();
