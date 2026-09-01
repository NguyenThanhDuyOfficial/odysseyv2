import { and, eq, isNotNull } from 'drizzle-orm';
import { db } from '../..';
import { NewProvider, Provider, providers } from '../schema/providers';
import { BaseRepository } from './base.repository';
import { mapDbError } from '@odyssey/error-handling';

export class ProviderRepository extends BaseRepository<Provider, NewProvider> {
  protected table = providers;
  protected tableName = 'Provider';

  async findByEmail(email: string): Promise<Provider | null> {
    try {
      const result = await db
        .select()
        .from(providers)
        .where(eq(providers.email, email))
        .limit(1);

      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findByProviderId(
    provider: string,
    providerId: string,
  ): Promise<Provider | null> {
    try {
      const result = await db
        .select()
        .from(providers)
        .where(
          and(
            eq(providers.provider, provider),
            eq(providers.providerId, providerId),
          ),
        )
        .limit(1);

      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findByUserId(userId: string): Promise<Provider[]> {
    try {
      const result = await db
        .select()
        .from(providers)
        .where(eq(providers.userId, userId));

      return result as Provider[];
    } catch (error) {
      throw mapDbError(error);
    }
  }

  async findWithPassword(email: string): Promise<Provider | null> {
    try {
      const result = await db
        .select()
        .from(providers)
        .where(
          and(eq(providers.email, email), isNotNull(providers.hashedPassword)),
        )
        .limit(1);

      return result[0]!;
    } catch (error) {
      throw mapDbError(error);
    }
  }
}
export const providerRepository = new ProviderRepository();
