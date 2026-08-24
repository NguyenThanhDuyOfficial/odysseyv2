'use client';

import { Button } from '@odyssey/ui/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
export default function Header() {
  const t = useTranslations('Header');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarLinks = [
    {
      title: t('guide'),
      href: 'wiki',
    },
    {
      title: t('blog'),
      href: 'blog',
    },
  ];
  return (
    <header className="sticky top-0 z-10 h-20 px-5 md:px-20 flex items-center justify-between bg-background">
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full min-h-[calc(100dvh-5rem)] py-8 flex flex-col gap-4 items-center bg-background">
          {navbarLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              {link.title}
            </Link>
          ))}
        </div>
      )}
      <div className="flex gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={t('openNavbar')}
          className="md:hidden"
        >
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </Button>
        <Link href="/" aria-label={t('goToHome')}>
          <h3>{t('appName')}</h3>
        </Link>
      </div>
      <div className="hidden md:block space-x-8">
        {navbarLinks.map((link, index) => (
          <Link key={index} href={link.href}>
            {link.title}
          </Link>
        ))}
      </div>
      <div className="flex gap-2 items-center ">
        <ThemeToggle />
        <Button
          variant="default"
          nativeButton={false}
          render={<Link href="login"></Link>}
        >
          {t('login')}
        </Button>
      </div>
    </header>
  );
}
