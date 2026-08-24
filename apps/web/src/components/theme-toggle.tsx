'use client';

import { useTheme } from '@wrksz/themes/client';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@odyssey/ui/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="">
      <Button
        size="icon"
        variant={resolvedTheme === 'light' ? 'outline' : 'ghost'}
        type="button"
        onClick={() => setTheme('light')}
      >
        <SunIcon />
      </Button>

      <Button
        size="icon"
        variant={resolvedTheme === 'dark' ? 'outline' : 'ghost'}
        type="button"
        onClick={() => setTheme('dark')}
      >
        <MoonIcon />
      </Button>
    </div>
  );
}
