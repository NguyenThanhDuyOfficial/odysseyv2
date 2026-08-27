'use client';

import { Button } from '@odyssey/ui/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from './theme-toggle';
import AuthForm from './AuthForm';
import useAuthStore from '../store/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@odyssey/ui/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { httpClient } from '../lib/httpClient';
import { useShallow } from 'zustand/shallow';
import { authClient } from '../lib/auth-client';
import Image from 'next/image';

export default function Header() {
  const t = useTranslations('Header');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const { data: session, isPending, error, refetch } = authClient.useSession();

  const { isAuthenticated, user, logout } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      logout: state.logout,
    })),
  );

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await httpClient.post('/auth/logout');
      return response;
    },
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      console.error(error);
      logout();
    },
  });

  const handleLogout = () => {
    if (session) {
      authClient.signOut();
    } else {
      logoutMutation.mutate();
    }
  };
  return (
    <header className="sticky top-0 z-10 w-full h-20 container mx-auto px-5 md:px-20 flex items-center justify-between bg-background">
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
        {isAuthenticated || session ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline">
                  {session?.user && (
                    <Image
                      src={session?.user.image}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                    ></Image>
                  )}
                  {session?.user
                    ? session.user.name
                    : user?.displayName
                      ? user.displayName
                      : user?.username}
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Button variant="ghost" onClick={handleLogout}>
                    {t('logout')}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="default" onClick={() => setIsFormOpen(!isFormOpen)}>
            {t('login')}
          </Button>
        )}
      </div>

      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full min-h-[calc(100dvh-5rem)] py-8 flex flex-col gap-4 items-center bg-background">
          {navbarLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              {link.title}
            </Link>
          ))}
        </div>
      )}

      {isFormOpen && !isAuthenticated && (
        <div className="absolute top-20 left-0 w-full min-h-[calc(100dvh-5rem)] py-8 pb-20 flex flex-col gap-4 items-center justify-center bg-background/40 backdrop-blur-sm">
          <AuthForm />
        </div>
      )}
    </header>
  );
}
