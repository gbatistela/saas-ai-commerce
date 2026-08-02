'use client';

import { PUBLIC_API_URL } from './config';

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Fetch client-side (Client Components) directo contra la API pública. */
export async function apiClientFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw new ApiClientError(res.status, data?.message ?? `Error ${res.status}`);
  }

  return data as T;
}
