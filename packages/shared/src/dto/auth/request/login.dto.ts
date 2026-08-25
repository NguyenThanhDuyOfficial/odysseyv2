import { z } from 'zod';
export const loginSchema = z.object({
  email: z
    .email('VALIDATION.EMAIL_INVALID')
    .min(1, 'VALIDATION.EMAIL_REQUIRED')
    .max(255, 'VALIDATION.EMAIL_TOO_LONG'),

  password: z
    .string()
    .min(8, 'VALIDATION.PASSWORD_TOO_SHORT')
    .max(100, 'VALIDATION.PASSWORD_TOO_LONG')
    .regex(/[A-Z]/, 'VALIDATION.PASSWORD_NO_UPPERCASE')
    .regex(/[a-z]/, 'VALIDATION.PASSWORD_NO_LOWERCASE')
    .regex(/[0-9]/, 'VALIDATION.PASSWORD_NO_NUMBER')
    .regex(/[^A-Za-z0-9]/, 'VALIDATION.PASSWORD_NO_SPECIAL_CHAR'),
});

export type loginDto = z.infer<typeof loginSchema>;
