import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';
import { getAccessToken } from '@/lib/session';

/**
 * Proxy genérico: los Client Components no pueden leer la cookie httpOnly
 * (por diseño, para que un XSS no pueda robar el token). En vez de eso,
 * llaman a /api/proxy/<lo que sea> con fetch normal (el browser manda la
 * cookie sola por ser same-origin) y este handler la adjunta como Bearer
 * antes de reenviar al backend real.
 */
async function forward(req: NextRequest, path: string[]) {
  const token = getAccessToken();
  const url = `${API_URL}/${path.join('/')}${req.nextUrl.search}`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  };

  if (!['GET', 'HEAD'].includes(req.method)) {
    const body = await req.text();
    if (body) init.body = body;
  }

  const res = await fetch(url, init);
  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  });
}

type Ctx = { params: { path: string[] } };

export async function GET(req: NextRequest, { params }: Ctx) {
  return forward(req, params.path);
}
export async function POST(req: NextRequest, { params }: Ctx) {
  return forward(req, params.path);
}
export async function PATCH(req: NextRequest, { params }: Ctx) {
  return forward(req, params.path);
}
export async function PUT(req: NextRequest, { params }: Ctx) {
  return forward(req, params.path);
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  return forward(req, params.path);
}
