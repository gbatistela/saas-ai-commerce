'use client';

const STORAGE_KEY = 'saas_storefront_session_id';

/** Identificador anónimo de carrito, persistido en localStorage por navegador. */
export function getCartSessionId(): string {
  if (typeof window === 'undefined') return '';

  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
