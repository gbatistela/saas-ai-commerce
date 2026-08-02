import 'server-only';
import { API_URL } from './config';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Fetch server-side contra la API pública del storefront (sin auth). */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    // Los datos de la tienda pueden cambiar seguido (stock, precios); se
    // revalida cada 30s en vez de cachear indefinidamente o pegarle a la
    // API en cada request.
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.message ?? `Error ${res.status} llamando a ${path}`);
  }

  return res.json() as Promise<T>;
}
