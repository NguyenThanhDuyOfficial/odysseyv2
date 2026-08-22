'use client';

import { useTheme } from '@wrksz/themes/client';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      Toggle theme
    </button>
  );
}
