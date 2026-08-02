'use client';

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Fetch desde Client Components, vía el proxy same-origin (ver /api/proxy). */
export async function apiClientFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw new ApiClientError(res.status, data?.message ?? `Error ${res.status}`);
  }

  return data as T;
}
