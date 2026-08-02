'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClientFetch, ApiClientError } from '@/lib/api-client';
import { getCartSessionId } from '@/lib/cart-session';

interface Pedido {
  numeroPedido: string;
}

export function CheckoutForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    cp: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(campo: K, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function confirmar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.telefono.trim() || !form.calle.trim() || !form.ciudad.trim()) {
      setError('Completá nombre, teléfono, calle y ciudad');
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      const pedido = await apiClientFetch<Pedido>(`/storefront/${slug}/checkout`, {
        method: 'POST',
        body: JSON.stringify({
          sessionId: getCartSessionId(),
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim() || undefined,
          direccion: {
            calle: form.calle.trim(),
            numero: form.numero.trim() || undefined,
            ciudad: form.ciudad.trim(),
            provincia: form.provincia.trim() || undefined,
            cp: form.cp.trim() || undefined,
          },
        }),
      });

      router.push(
        `/${slug}/pedidos/${pedido.numeroPedido}?contacto=${encodeURIComponent(form.telefono.trim())}`,
      );
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'No se pudo confirmar el pedido');
      setEnviando(false);
    }
  }

  const inputClass =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <form onSubmit={confirmar} className="space-y-5">
      <div className="space-y-3">
        <p className="text-sm font-medium">Tus datos</p>
        <input
          className={inputClass}
          placeholder="Nombre y apellido *"
          value={form.nombre}
          onChange={(e) => set('nombre', e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Teléfono *"
          value={form.telefono}
          onChange={(e) => set('telefono', e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Email (opcional)"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Dirección de envío</p>
        <div className="grid grid-cols-3 gap-2">
          <input
            className={`${inputClass} col-span-2`}
            placeholder="Calle *"
            value={form.calle}
            onChange={(e) => set('calle', e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Número"
            value={form.numero}
            onChange={(e) => set('numero', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            className={`${inputClass} col-span-2`}
            placeholder="Ciudad *"
            value={form.ciudad}
            onChange={(e) => set('ciudad', e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="CP"
            value={form.cp}
            onChange={(e) => set('cp', e.target.value)}
          />
        </div>
        <input
          className={inputClass}
          placeholder="Provincia"
          value={form.provincia}
          onChange={(e) => set('provincia', e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={enviando}>
        {enviando ? 'Confirmando...' : 'Confirmar pedido'}
      </Button>
    </form>
  );
}
