'use client';

import { Button } from '@odyssey/ui/components/ui/button';
import { authClient } from '../lib/auth-client';
import { SiDiscord } from '@icons-pack/react-simple-icons';

export function SignInWithDiscordButton({
  callbackURL = '/',
}: {
  callbackURL: string;
}) {
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'discord',
      callbackURL,
    });
  };

  return (
    <Button onClick={handleSignIn}>
      <SiDiscord></SiDiscord>Discord
    </Button>
  );
}
