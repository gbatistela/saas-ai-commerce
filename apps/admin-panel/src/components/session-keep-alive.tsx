'use client';

import { useEffect } from 'react';

const INTERVALO_MS = 10 * 60 * 1000; // 10 minutos (access token dura 15m)

/**
 * El access token del backend dura 15 minutos. En vez de mandar al usuario
 * a loguearse de nuevo en medio de una demo, renovamos la sesión en
 * segundo plano mientras el panel esté abierto.
 */
export function SessionKeepAlive() {
  useEffect(() => {
    const id = setInterval(() => {
      fetch('/api/auth/refresh', { method: 'POST' }).catch(() => {
        /* si falla, la próxima navegación va a rebotar a /login igual */
      });
    }, INTERVALO_MS);

    return () => clearInterval(id);
  }, []);

  return null;
}
