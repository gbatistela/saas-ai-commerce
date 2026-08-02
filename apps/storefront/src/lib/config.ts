// URL interna (server-side, Server Components): más rápida, no sale a internet.
export const API_URL = process.env.API_URL ?? 'http://localhost:3000/api/v1';

// URL pública (client-side, fetch desde el browser del comprador): tiene que
// ser alcanzable desde afuera. Si cambia la IP/dominio del backend, actualizar
// NEXT_PUBLIC_API_URL en .env.local.
export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? API_URL;
