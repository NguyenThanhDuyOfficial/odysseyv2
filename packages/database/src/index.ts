import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users as usersTable } from './db/schema';
import { eq } from 'drizzle-orm';

export const db = drizzle({ connection: process.env.DATABASE_URL! });

async function main() {
  const user: typeof usersTable.$inferInsert = {
    username: 'nguyenthanhduy',
    displayName: 'ken',
    email: 'nguyenthanhduyofficial@gmail.com',
  };

  await db.insert(usersTable).values(user);
  console.log('new user created');

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);

  if (!user.email) {
    throw new Error('Email is required');
  }
  await db
    .update(usersTable)
    .set({
      displayName: 'Ken',
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!');

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!');
}
main();
