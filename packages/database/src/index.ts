import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './db/relations';

export const db = drizzle(process.env.DATABASE_URL!, { relations });

export * from './db/repositories/index';
export * from './db/schema/index';
