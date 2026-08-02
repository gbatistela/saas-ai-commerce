'use client';

import { useEffect, useState } from 'react';
import { Link2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClientFetch } from '@/lib/api-client';
import type { ProductoResumen, Relacionado } from './types';

const TIPOS = [
  { value: 'SIMILAR', label: 'Similar' },
  { value: 'COMPLEMENTARIO', label: 'Complementario' },
  { value: 'COMBO', label: 'Combo' },
] as const;

export function RelacionadosTab({
  productoId,
  relacionados,
  onCambio,
}: {
  productoId: string;
  relacionados: Relacionado[];
  onCambio: () => void;
}) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<ProductoResumen[]>([]);
  const [seleccionado, setSeleccionado] = useState<ProductoResumen | null>(null);
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]['value']>('SIMILAR');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busqueda.trim()) {
      setResultados([]);
      return;
    }
    const id = setTimeout(() => {
      apiClientFetch<{ data: ProductoResumen[] }>(`/productos?texto=${encodeURIComponent(busqueda)}`)
        .then((res) => setResultados(res.data.filter((p) => p.id !== productoId)))
        .catch(() => setResultados([]));
    }, 300);
    return () => clearTimeout(id);
  }, [busqueda, productoId]);

  async function vincular() {
    if (!seleccionado) return;
    setError(null);
    try {
      await apiClientFetch(`/productos/${productoId}/relacionados`, {
        method: 'POST',
        body: JSON.stringify({ relacionadoId: seleccionado.id, tipo }),
      });
      setSeleccionado(null);
      setBusqueda('');
      onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo vincular');
    }
  }

  return (
    <div className="space-y-4">
      {relacionados.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin productos relacionados todavía.</p>
      ) : (
        <ul className="space-y-1.5">
          {relacionados.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                {r.relacionado.nombre}
              </span>
              <span className="text-xs text-muted-foreground">{r.tipo}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
        <p className="text-xs font-medium uppercase text-muted-foreground">Vincular producto</p>
        <Input
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setSeleccionado(null);
          }}
          placeholder="Buscar producto por nombre o SKU..."
        />
        {resultados.length > 0 && !seleccionado && (
          <ul className="max-h-32 overflow-y-auto rounded-md border border-border">
            {resultados.map((p) => (
              <li key={p.id}>
                <button
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    setSeleccionado(p);
                    setBusqueda(p.nombre);
                    setResultados([]);
                  }}
                >
                  {p.nombre} <span className="text-xs text-muted-foreground">({p.sku})</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <Select value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={vincular} disabled={!seleccionado}>
            <Plus className="h-3.5 w-3.5" /> Vincular
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
