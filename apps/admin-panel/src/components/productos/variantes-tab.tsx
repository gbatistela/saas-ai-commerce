'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClientFetch } from '@/lib/api-client';
import { formatMoneda } from '@/lib/format';
import type { Variante } from './types';

export function VariantesTab({
  productoId,
  variantes,
  onCambio,
}: {
  productoId: string;
  variantes: Variante[];
  onCambio: () => void;
}) {
  const [color, setColor] = useState('');
  const [talle, setTalle] = useState('');
  const [sku, setSku] = useState('');
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function agregarVariante() {
    if (!sku.trim()) return;
    setCreando(true);
    setError(null);
    try {
      await apiClientFetch(`/productos/${productoId}/variantes`, {
        method: 'POST',
        body: JSON.stringify({
          skuVariante: sku.trim(),
          color: color.trim() || undefined,
          talle: talle.trim() || undefined,
        }),
      });
      setColor('');
      setTalle('');
      setSku('');
      onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la variante');
    } finally {
      setCreando(false);
    }
  }

  async function actualizarStock(varianteId: string, cantidad: number) {
    await apiClientFetch(`/variantes/${varianteId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ cantidad }),
    });
    onCambio();
  }

  return (
    <div className="space-y-4">
      {variantes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay variantes cargadas.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-medium uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Color</th>
                <th className="px-3 py-2">Talle</th>
                <th className="px-3 py-2">Precio +</th>
                <th className="px-3 py-2">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {variantes.map((v) => (
                <tr key={v.id}>
                  <td className="px-3 py-2">{v.skuVariante}</td>
                  <td className="px-3 py-2 text-muted-foreground">{v.color ?? '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">{v.talle ?? '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {Number(v.precioAdicional) > 0 ? formatMoneda(Number(v.precioAdicional)) : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      defaultValue={v.stock[0]?.cantidad ?? 0}
                      className="h-7 w-20"
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (!Number.isNaN(val) && val !== v.stock[0]?.cantidad) {
                          actualizarStock(v.id, val);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
        <p className="text-xs font-medium uppercase text-muted-foreground">Agregar variante</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">SKU *</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-M" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Color</Label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Talle</Label>
            <Input value={talle} onChange={(e) => setTalle(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button size="sm" variant="outline" onClick={agregarVariante} disabled={creando || !sku.trim()}>
          <Plus className="h-3.5 w-3.5" /> Agregar
        </Button>
      </div>
    </div>
  );
}
