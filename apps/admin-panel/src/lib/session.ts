import 'server-only';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from './config';

export interface SessionUser {
  userId: string;
  empresaId: string;
  email: string;
  rol: 'OWNER' | 'ADMIN' | 'AGENTE';
}

/**
 * El backend (NestJS) es la única autoridad real sobre la validez del
 * token: acá solo lo decodificamos (sin verificar firma) para saber quién
 * es el usuario y mostrarlo en la UI. Cualquier request a la API que use
 * este token inválido/expirado va a rebotar con 401 igual.
 */
function decodePayload(token: string): SessionUser | null {
  try {
    const [, payloadB64] = token.split('.');
    const json = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(json);
    return {
      userId: payload.sub,
      empresaId: payload.empresaId,
      email: payload.email,
      rol: payload.rol,
    };
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return cookies().get(AUTH_COOKIE)?.value ?? null;
}

export function getSession(): SessionUser | null {
  const token = getAccessToken();
  if (!token) return null;
  return decodePayload(token);
}
