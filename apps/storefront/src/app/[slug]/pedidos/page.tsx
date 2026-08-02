'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BuscarPedidoPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [numero, setNumero] = useState('');
  const [contacto, setContacto] = useState('');

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (!numero.trim() || !contacto.trim()) return;
    router.push(
      `/${params.slug}/pedidos/${numero.trim()}?contacto=${encodeURIComponent(contacto.trim())}`,
    );
  }

  const inputClass =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-2xl font-semibold">Seguir mi pedido</h1>
      <form onSubmit={buscar} className="space-y-3">
        <input
          className={inputClass}
          placeholder="Número de pedido"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Teléfono o email usado en la compra"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Buscar
        </Button>
      </form>
    </div>
  );
}
