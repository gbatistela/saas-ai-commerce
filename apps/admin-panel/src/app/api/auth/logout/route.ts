import { NextResponse } from 'next/server';
import { AUTH_COOKIE, REFRESH_COOKIE } from '@/lib/config';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(AUTH_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
