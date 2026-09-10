import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './db/relations';

export * from './db/schema/index';
export * from './db/repositories/index';
export const db = drizzle(process.env.DATABASE_URL!, { relations });
