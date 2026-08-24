// apps/web/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../../services/auth.service';
import { errorResponse, successResponse } from '@odyssey/shared';
import { formatError } from '@odyssey/error-handling';

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('access_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        errorResponse('Access token required', 'INVALID_TOKEN'),
      );
    }

    const user = await authService.getUserFromToken(token);

    return NextResponse.json(successResponse(user));
  } catch (error: any) {
    return NextResponse.json(formatError(error));
  }
}
