import {
  errorResponse,
  RegisterSchema,
  successResponse,
} from '@odyssey/shared';
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../../services/auth.service';
import { formatError } from '@odyssey/error-handling';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        errorResponse('Validation failed', 'VALIDATION_ERROR', result.error),
      );
    }

    const data = await authService.register(result.data);
    const response = NextResponse.json(successResponse(data));

    response.cookies.set('access_token', data.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });

    response.cookies.set('refresh_token', data.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json(formatError(error));
  }
}
