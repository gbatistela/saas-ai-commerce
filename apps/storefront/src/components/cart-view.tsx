'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClientFetch } from '@/lib/api-client';
import { getCartSessionId } from '@/lib/cart-session';
import { formatMoneda } from '@/lib/format';
import type { Carrito } from '@/lib/types';

export function CartView({ slug }: { slug: string }) {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    const sessionId = getCartSessionId();
    const c = await apiClientFetch<Carrito>(`/storefront/${slug}/carrito?sessionId=${sessionId}`);
    setCarrito(c);
    setCargando(false);
  }, [slug]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function actualizarCantidad(itemId: string, cantidad: number) {
    await apiClientFetch(`/storefront/${slug}/carrito/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ sessionId: getCartSessionId(), cantidad }),
    });
    cargar();
  }

  async function eliminar(itemId: string) {
    await apiClientFetch(
      `/storefront/${slug}/carrito/items/${itemId}?sessionId=${getCartSessionId()}`,
      { method: 'DELETE' },
    );
    cargar();
  }

  if (cargando) {
    return <p className="text-sm text-muted-foreground">Cargando carrito...</p>;
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">Tu carrito está vacío.</p>
        <Button asChild variant="outline">
          <Link href={`/${slug}`}>Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  const total = carrito.items.reduce(
    (sum, i) => sum + i.cantidad * Number(i.precioUnitario),
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tu carrito</h1>

      <div className="divide-y divide-border rounded-xl border border-border">
        {carrito.items.map((item) => {
          const stockDisponible = item.variante.stock.reduce((s, x) => s + x.cantidad, 0);
          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl">
                🛍️
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.variante.producto.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {[item.variante.color, item.variante.talle].filter(Boolean).join(' / ')}
                </p>
                <p className="text-sm">{formatMoneda(Number(item.precioUnitario))}</p>
              </div>
              <div className="flex items-center rounded-md border border-input">
                <button
                  className="p-1.5 disabled:opacity-40"
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm">{item.cantidad}</span>
                <button
                  className="p-1.5 disabled:opacity-40"
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  disabled={item.cantidad >= stockDisponible}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => eliminar(item.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span>{formatMoneda(total)}</span>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href={`/${slug}/checkout`}>Continuar al checkout</Link>
      </Button>
    </div>
  );
}
