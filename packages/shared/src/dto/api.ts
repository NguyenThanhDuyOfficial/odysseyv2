import { ZodError } from 'zod';

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | ZodError;
  };
}

export function successResponse<T>(
  data: T,
  message?: string,
): ApiSuccessResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(
  message: string,
  code = 'ERROR',
  details?: Record<string, unknown> | ZodError,
): ApiErrorResponse {
  return {
    success: false,
    error: { code, message, details },
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
