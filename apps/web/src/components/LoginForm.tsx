'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ApiResponse,
  LoginDTO,
  LoginResponseDTO,
  LoginSchema,
} from '@odyssey/shared';
import { useForm } from 'react-hook-form';
import { httpClient } from '../lib/httpClient';
import { Alert } from '@odyssey/ui/components/ui/alert';
import { Input } from '@odyssey/ui/components/ui/input';
import { Button } from '@odyssey/ui/components/ui/button';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { SignInWithDiscordButton } from './SignInWithDiscordButton';
import { usePathname } from 'next/navigation';

export default function LoginForm() {
  const t = useTranslations('AuthForm');
  const e = useTranslations('Error');

  const pathname = usePathname();

  const login = useAuthStore((state) => state.login);

  const form = useForm<LoginDTO>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginDTO): Promise<LoginResponseDTO> => {
      const response = await httpClient.post<ApiResponse<LoginResponseDTO>>(
        '/auth/login',
        data,
      );
      if (!response.success) {
        throw new Error(response.error?.message || 'LOGIN_FAILED');
      }
      return response.data!;
    },
    onSuccess: (data: LoginResponseDTO) => {
      login(data.user, data.tokens.accessToken);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const handleLogin = (data: LoginDTO) => {
    loginMutation.mutate(data);
  };

  const isLoading = loginMutation.isPending;
  const error = loginMutation.error;
  return (
    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mt-4">
          {e(error.message)}
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <label>{t('email')}</label>
        <Input
          type="email"
          placeholder="example@gmail.com"
          {...form.register('email')}
          disabled={isLoading}
          required
        ></Input>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive mt-1">
            {e(form.formState.errors.email.message!)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label> {t('password')}</label>
        <Input
          type="password"
          placeholder="********"
          {...form.register('password')}
          disabled={isLoading}
          required
        ></Input>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive mt-1">
            {e(form.formState.errors.password.message!)}
          </p>
        )}
      </div>
      <div className="flex items-center mt-8 gap-8">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('isLoading') : t('login')}
        </Button>
        <SignInWithDiscordButton
          callbackURL={pathname}
        ></SignInWithDiscordButton>
      </div>
    </form>
  );
}
