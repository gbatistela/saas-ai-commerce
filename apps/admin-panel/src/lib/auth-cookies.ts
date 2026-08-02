import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, REFRESH_COOKIE } from './config';

/**
 * Si el request llegó por HTTPS (directo o vía proxy con x-forwarded-proto),
 * marcamos las cookies Secure. NODE_ENV==='production' NO es un proxy válido
 * para esto: `next start` corre en modo "production" aunque el sitio esté
 * servido en HTTP plano (ej. detrás de una IP sin TLS todavía), y una cookie
 * Secure en un contexto no-HTTPS el browser la descarta en silencio — el
 * login "funciona" (200) pero la sesión nunca queda guardada.
 */
function esHttps(req: NextRequest): boolean {
  return req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';
}

export function setSessionCookies(
  req: NextRequest,
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  const secure = esHttps(req);

  response.cookies.set(AUTH_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // igual al access token del backend (15m)
  });

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // igual al refresh token del backend (7d)
  });
}
