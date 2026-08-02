import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';
import { setSessionCookies } from '@/lib/auth-cookies';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.message ?? 'No se pudo iniciar sesión' },
      { status: res.status },
    );
  }

  const response = NextResponse.json({ usuario: data.usuario });
  setSessionCookies(req, response, data.accessToken, data.refreshToken);
  return response;
}
