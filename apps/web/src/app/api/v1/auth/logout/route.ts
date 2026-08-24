import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../../services/auth.service';
import { successResponse } from '@odyssey/shared';
import { formatError } from '@odyssey/error-handling';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    const response = NextResponse.json(successResponse({}));

    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  } catch (error) {
    return NextResponse.json(formatError(error));
  }
}
