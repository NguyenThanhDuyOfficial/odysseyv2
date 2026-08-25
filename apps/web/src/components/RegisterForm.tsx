'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ApiResponse,
  RegisterDTO,
  RegisterResponseDTO,
  RegisterSchema,
} from '@odyssey/shared';
import { useForm } from 'react-hook-form';
import { httpClient } from '../lib/httpClient';
import { Alert } from '@odyssey/ui/components/ui/alert';
import { Input } from '@odyssey/ui/components/ui/input';
import { Button } from '@odyssey/ui/components/ui/button';
import { useTranslations } from 'next-intl';
import useAuthStore from '../store/authStore';
import { useMutation } from '@tanstack/react-query';

export default function RegisterForm() {
  const t = useTranslations('AuthForm');
  const e = useTranslations('Error');

  const login = useAuthStore((state) => state.login);

  const form = useForm<RegisterDTO>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterDTO): Promise<RegisterResponseDTO> => {
      const response = await httpClient.post<ApiResponse<RegisterResponseDTO>>(
        '/auth/register',
        data,
      );
      if (!response.success) {
        throw new Error(response.error?.message || 'LOGIN_FAILED');
      }
      return response.data!;
    },
    onSuccess: (data: RegisterResponseDTO) => {
      login(data.user, data.tokens.accessToken);
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const handleRegister = (data: RegisterDTO) => {
    registerMutation.mutate(data);
  };

  const isLoading = registerMutation.isPending;
  const error = registerMutation.error;

  return (
    <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mt-4">
          {e(error.message)}
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <label>{t('username')}</label>
        <Input
          type="text"
          placeholder="_nguyenthanhduyofficial_"
          {...form.register('username')}
          disabled={isLoading}
          required
        ></Input>
        {form.formState.errors.username && (
          <p className="text-sm text-destructive mt-1">
            {e(form.formState.errors.username.message!)}
          </p>
        )}
      </div>
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
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isLoading} className="mt-4">
        {isLoading ? t('isLoading') : t('register')}
      </Button>
    </form>
  );
}
