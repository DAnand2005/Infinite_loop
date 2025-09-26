import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // These are public paths
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next();
  }

  // Check for auth cookie for protected routes
  const authCookie = request.cookies.get('firebaseIdToken');

  if (!authCookie && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
