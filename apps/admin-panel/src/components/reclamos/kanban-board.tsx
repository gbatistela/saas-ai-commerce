'use client';

import { useCallback, useState } from 'react';
import { Plus, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { apiClientFetch } from '@/lib/api-client';
import { COLUMNAS } from './estado';
import { ReclamoCard } from './reclamo-card';
import { ReclamoDetailDialog } from './reclamo-detail-dialog';
import { CreateReclamoDialog } from './create-reclamo-dialog';
import type { EstadoReclamo, ReclamoResumen } from './types';

export function KanbanBoard({ reclamosIniciales }: { reclamosIniciales: ReclamoResumen[] }) {
  const [reclamos, setReclamos] = useState(reclamosIniciales);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [crearAbierto, setCrearAbierto] = useState(false);
  const [columnaSobre, setColumnaSobre] = useState<EstadoReclamo | null>(null);

  const recargar = useCallback(async () => {
    const res = await apiClientFetch<{ data: ReclamoResumen[] }>('/reclamos?limit=100');
    setReclamos(res.data);
  }, []);

  async function moverA(id: string, estado: EstadoReclamo) {
    setReclamos((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)));
    try {
      await apiClientFetch(`/reclamos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
    } catch {
      recargar();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Reclamos</h1>
        <Button onClick={() => setCrearAbierto(true)}>
          <Plus className="h-4 w-4" /> Nuevo reclamo
        </Button>
      </div>

      {reclamos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border py-16 text-center">
          <Ticket className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Sin reclamos todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 overflow-x-auto sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNAS.map((col) => {
            const items = reclamos.filter((r) => r.estado === col.estado);
            return (
              <div
                key={col.estado}
                onDragOver={(e) => {
                  e.preventDefault();
                  setColumnaSobre(col.estado);
                }}
                onDragLeave={() => setColumnaSobre((c) => (c === col.estado ? null : c))}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain');
                  if (id) moverA(id, col.estado);
                  setColumnaSobre(null);
                }}
                className={cn(
                  'flex min-h-[300px] flex-col gap-2 rounded-xl border border-border bg-muted/30 p-2 transition-colors',
                  columnaSobre === col.estado && 'border-primary bg-primary/5',
                )}
              >
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {col.label}
                  </p>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {items.map((r) => (
                    <ReclamoCard
                      key={r.id}
                      reclamo={r}
                      onClick={() => setSeleccionado(r.id)}
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', r.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ReclamoDetailDialog
        reclamoId={seleccionado}
        onOpenChange={(open) => !open && setSeleccionado(null)}
        onCambio={recargar}
      />
      <CreateReclamoDialog open={crearAbierto} onOpenChange={setCrearAbierto} onCreado={recargar} />
    </div>
  );
}
