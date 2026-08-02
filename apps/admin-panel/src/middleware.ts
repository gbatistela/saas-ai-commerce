import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/config';

export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(AUTH_COOKIE)?.value);
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');

  if (!hasSession && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (hasSession && isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
