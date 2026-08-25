import { db } from '../..';
import { eq } from 'drizzle-orm';
import { mapDbError } from '@odyssey/error-handling';

export abstract class BaseRepository<T, TInsert> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract table: any;
  protected abstract tableName: string;

  async findById(id: string): Promise<T | null> {
    try {
      const [result] = await db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id))
        .limit(1);
      return result || null;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await db.select().from(this.table);
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async create(data: TInsert): Promise<T> {
    try {
      const result = (await db
        .insert(this.table)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .values(data as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .returning()) as any;
      return result[0] as T;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async update(id: string, data: Partial<TInsert>): Promise<T> {
    try {
      const [result] = await db
        .update(this.table)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(this.table.id, id))
        .returning();
      return result!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db
        .delete(this.table)
        .where(eq(this.table.id, id))
        .returning({ id: this.table.id });
    } catch (error) {
      throw mapDbError(error);
    }
  }
}
