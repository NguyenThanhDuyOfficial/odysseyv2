'use client';

import { useTheme } from '@wrksz/themes/client';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@odyssey/ui/components/ui/button';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('Common');

  return (
    <div className="">
      <Button
        size="icon"
        variant={resolvedTheme === 'light' ? 'outline' : 'ghost'}
        type="button"
        onClick={() => setTheme('light')}
        aria-label={t('light')}
      >
        <SunIcon />
      </Button>

      <Button
        size="icon"
        variant={resolvedTheme === 'dark' ? 'outline' : 'ghost'}
        type="button"
        onClick={() => setTheme('dark')}
        aria-label={t('dark')}
      >
        <MoonIcon />
      </Button>
    </div>
  );
}
