'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ContactoForm({ slug, numero }: { slug: string; numero: string }) {
  const router = useRouter();
  const [contacto, setContacto] = useState('');

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (!contacto.trim()) return;
    router.push(`/${slug}/pedidos/${numero}?contacto=${encodeURIComponent(contacto.trim())}`);
  }

  return (
    <form onSubmit={buscar} className="mx-auto max-w-sm space-y-3">
      <p className="text-sm text-muted-foreground">
        Ingresá el teléfono o email que usaste en la compra para ver el estado del pedido #{numero}.
      </p>
      <input
        value={contacto}
        onChange={(e) => setContacto(e.target.value)}
        placeholder="Teléfono o email"
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <Button type="submit" className="w-full">
        Ver estado
      </Button>
    </form>
  );
}
