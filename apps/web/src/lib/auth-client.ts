import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000/api/v1/auth',
});

export const signInWithDiscord = async () => {
  const data = await authClient.signIn.social({
    provider: 'discord',
  });
};
