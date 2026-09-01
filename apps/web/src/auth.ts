import {
  db,
  providers,
  users,
  sessions,
  verifications,
} from '@odyssey/database';
import * as schema from '@odyssey/database/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
      user: users,
      account: providers,
      session: sessions,
      verification: verifications,
    },
  }),
  user: {
    modelName: 'users',
    fields: {
      name: 'username',
      image: 'avatarUrl',
    },
  },
  session: {
    modelName: 'sessions',
  },
  account: {
    modelName: 'providers',
    fields: {
      issuer: 'provider',
      password: 'hashedPassword',
    },
  },
  verification: {
    modelName: 'verifications',
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
});

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: DrizzleAdapter(db, {
//     usersTable: users,
//   }),
//   providers: [Discord],
//   // callbacks: {
//   //   async signIn({ user, account, profile }) {
//   //     try {
//   //       if (!account?.providerAccountId) {
//   //         return false;
//   //       }
//   //       let dbProvider = await providerRepository.findByProviderId(
//   //         account.provider,
//   //         account.providerAccountId,
//   //       );
//   //       if (!dbProvider) {
//   //         dbProvider = await providerRepository.create({
//   //           userId: user.id!,
//   //           provider: account?.provider,
//   //           email: user.email,
//   //           providerId: account?.providerAccountId,
//   //           refreshToken: account?.refresh_token,
//   //           tokenExpiresAt: new Date(account.expires_at! * 1000),
//   //         });
//   //       }
//   //       let dbUser = await userRepository.findById(dbProvider.userId);
//   //       if (!dbUser) {
//   //         dbUser = await userRepository.create({
//   //           username: user.name!,
//   //           email: user.email,
//   //           displayName: user.name,
//   //           avatarUrl: user.image,
//   //         });
//   //       }
//   //       const login = useAuthStore((state) => state.login);
//   //       // I need call api to get tokens here
//   //       login(dbUser);
//   //       return true;
//   //     } catch (error) {
//   //       return false;
//   //     }
//   //   },
//   // },
// });
