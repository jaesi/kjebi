import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const PUBLIC_PATHS = ['/login'];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.includes(pathname) ||
  pathname.startsWith('/api/auth') ||
  pathname.startsWith('/_next') ||
  pathname === '/favicon.ico';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
