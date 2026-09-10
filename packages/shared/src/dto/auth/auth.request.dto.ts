import { z } from 'zod';
export const RegisterSchema = z.object({
  username: z
    .string()
    .min(1, 'USERNAME_REQUIRED')
    .max(100, 'USERNAME_TOO_LONG'),

  email: z
    .email('EMAIL_INVALID')
    .min(1, 'EMAIL_REQUIRED')
    .max(255, 'EMAIL_TOO_LONG'),

  password: z
    .string()
    .min(8, 'PASSWORD_TOO_SHORT')
    .max(100, 'PASSWORD_TOO_LONG')
    .regex(/[A-Z]/, 'PASSWORD_NO_UPPERCASE')
    .regex(/[a-z]/, 'PASSWORD_NO_LOWERCASE')
    .regex(/[0-9]/, 'PASSWORD_NO_NUMBER')
    .regex(/[^A-Za-z0-9]/, 'PASSWORD_NO_SPECIAL_CHAR'),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z
    .email('EMAIL_INVALID')
    .min(1, 'EMAIL_REQUIRED')
    .max(255, 'EMAIL_TOO_LONG'),

  password: z
    .string()
    .min(8, 'PASSWORD_TOO_SHORT')
    .max(100, 'PASSWORD_TOO_LONG')
    .regex(/[A-Z]/, 'PASSWORD_NO_UPPERCASE')
    .regex(/[a-z]/, 'PASSWORD_NO_LOWERCASE')
    .regex(/[0-9]/, 'PASSWORD_NO_NUMBER')
    .regex(/[^A-Za-z0-9]/, 'PASSWORD_NO_SPECIAL_CHAR'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
