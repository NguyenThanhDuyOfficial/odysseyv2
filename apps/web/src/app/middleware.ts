import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authService } from '../services/auth.service';
import { errorResponse } from '@odyssey/shared';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/auth',
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh',
  '/api/v1/auth/logout',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password',
  '/api/v1/auth/verify-email',
  '/api/v1/auth/google',
  '/api/v1/auth/google/callback',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|css|js|ico)$/)) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get('access_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        errorResponse('Authentication required', 'INVALID_TOKEN'),
      );
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await authService.getUserFromToken(token);
    return NextResponse.next();
  } catch (error) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        errorResponse('Invalid or expired token', 'INVALID_OR_EXPIRED_TOKEN'),
      );
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
