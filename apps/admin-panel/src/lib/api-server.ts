import 'server-only';
import { API_URL } from './config';
import { getAccessToken } from './session';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Fetch server-side (Server Components / Route Handlers) contra la API
 * de NestJS, adjuntando el JWT de la cookie de sesión.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.message ?? `Error ${res.status} llamando a ${path}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
