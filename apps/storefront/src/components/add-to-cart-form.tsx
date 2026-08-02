'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClientFetch, ApiClientError } from '@/lib/api-client';
import { getCartSessionId } from '@/lib/cart-session';
import { formatMoneda } from '@/lib/format';
import type { ProductoDetalle } from '@/lib/types';

export function AddToCartForm({ slug, producto }: { slug: string; producto: ProductoDetalle }) {
  const router = useRouter();
  const [varianteId, setVarianteId] = useState(producto.variantes[0]?.id ?? '');
  const [cantidad, setCantidad] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agregado, setAgregado] = useState(false);

  const variante = producto.variantes.find((v) => v.id === varianteId);
  const stockDisponible = variante?.stock.reduce((s, x) => s + x.cantidad, 0) ?? 0;
  const precioFinal = Number(producto.precio) + Number(variante?.precioAdicional ?? 0);

  const talles = Array.from(new Set(producto.variantes.map((v) => v.talle).filter(Boolean)));
  const colores = Array.from(new Set(producto.variantes.map((v) => v.color).filter(Boolean)));

  function seleccionarPor(talle?: string | null, color?: string | null) {
    const match = producto.variantes.find(
      (v) => (talle === undefined || v.talle === talle) && (color === undefined || v.color === color),
    );
    if (match) setVarianteId(match.id);
  }

  async function agregar() {
    if (!variante) return;
    setEnviando(true);
    setError(null);
    setAgregado(false);
    try {
      await apiClientFetch(`/storefront/${slug}/carrito`, {
        method: 'POST',
        body: JSON.stringify({
          sessionId: getCartSessionId(),
          varianteId: variante.id,
          cantidad,
        }),
      });
      setAgregado(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'No se pudo agregar al carrito');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-2xl font-semibold">{formatMoneda(precioFinal)}</p>

      {talles.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Talle</p>
          <div className="flex flex-wrap gap-2">
            {talles.map((t) => (
              <button
                key={t}
                onClick={() => seleccionarPor(t, undefined)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  variante?.talle === t
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:bg-accent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {colores.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Color</p>
          <div className="flex flex-wrap gap-2">
            {colores.map((c) => (
              <button
                key={c}
                onClick={() => seleccionarPor(undefined, c)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  variante?.color === c
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:bg-accent'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-input">
          <button
            className="p-2 disabled:opacity-40"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            disabled={cantidad <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm">{cantidad}</span>
          <button
            className="p-2 disabled:opacity-40"
            onClick={() => setCantidad((c) => Math.min(stockDisponible, c + 1))}
            disabled={cantidad >= stockDisponible}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          {stockDisponible > 0 ? `${stockDisponible} disponibles` : 'Sin stock'}
        </span>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={agregar}
        disabled={enviando || stockDisponible <= 0 || !variante}
      >
        <ShoppingBag className="h-4 w-4" />
        {enviando ? 'Agregando...' : 'Agregar al carrito'}
      </Button>

      {agregado && <p className="text-sm text-success">Se agregó al carrito.</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
