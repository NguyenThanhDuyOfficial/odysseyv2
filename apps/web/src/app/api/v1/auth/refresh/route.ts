import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../../services/auth.service';
import { formatError } from '@odyssey/error-handling';
import { errorResponse, successResponse } from '@odyssey/shared';

export async function POST(request: NextRequest) {
  try {
    let refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      const body = await request.json().catch(() => ({}));
      refreshToken = body.refreshToken;
    }

    if (!refreshToken) {
      return NextResponse.json(
        errorResponse('Refresh token required', 'INVALID_TOKEN'),
      );
    }

    const data = await authService.refreshToken(refreshToken);

    const response = NextResponse.json(successResponse(data));

    response.cookies.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.expiresIn,
      path: '/',
    });

    return response;
  } catch (error: any) {
    const response = NextResponse.json(formatError(error));

    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  }
}
