import { NextRequest, NextResponse } from 'next/server';
import { API_URL, AUTH_COOKIE, REFRESH_COOKIE } from '@/lib/config';
import { setSessionCookies } from '@/lib/auth-cookies';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'Sin sesión' }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const response = NextResponse.json({ message: 'Sesión expirada' }, { status: 401 });
    response.cookies.delete(AUTH_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const data = await res.json();
  const response = NextResponse.json({ ok: true });
  setSessionCookies(req, response, data.accessToken, data.refreshToken);
  return response;
}
