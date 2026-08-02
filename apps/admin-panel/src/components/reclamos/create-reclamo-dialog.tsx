'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClientFetch } from '@/lib/api-client';
import type { ClienteBusqueda } from './types';

export function CreateReclamoDialog({
  open,
  onOpenChange,
  onCreado,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreado: () => void;
}) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<ClienteBusqueda[]>([]);
  const [cliente, setCliente] = useState<ClienteBusqueda | null>(null);
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setBusqueda('');
      setResultados([]);
      setCliente(null);
      setTipo('');
      setDescripcion('');
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!busqueda.trim() || cliente) {
      setResultados([]);
      return;
    }
    const id = setTimeout(() => {
      apiClientFetch<{ data: ClienteBusqueda[] }>(`/clientes?nombre=${encodeURIComponent(busqueda)}`)
        .then((r) => setResultados(r.data))
        .catch(() => setResultados([]));
    }, 300);
    return () => clearTimeout(id);
  }, [busqueda, cliente]);

  async function crear() {
    if (!cliente || !tipo.trim() || !descripcion.trim()) {
      setError('Completá cliente, tipo y descripción');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await apiClientFetch('/reclamos', {
        method: 'POST',
        body: JSON.stringify({ clienteId: cliente.id, tipo: tipo.trim(), descripcion: descripcion.trim() }),
      });
      onCreado();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear el reclamo');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo reclamo</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Cliente *</Label>
            <Input
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setCliente(null);
              }}
              placeholder="Buscar por nombre..."
            />
            {resultados.length > 0 && !cliente && (
              <ul className="max-h-32 overflow-y-auto rounded-md border border-border">
                {resultados.map((c) => (
                  <li key={c.id}>
                    <button
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                      onClick={() => {
                        setCliente(c);
                        setBusqueda(c.nombre || c.telefono || '');
                        setResultados([]);
                      }}
                    >
                      {c.nombre || 'Sin nombre'}{' '}
                      <span className="text-xs text-muted-foreground">({c.telefono})</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-1">
            <Label>Tipo *</Label>
            <Input
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="producto_defectuoso, demora, etc."
            />
          </div>

          <div className="space-y-1">
            <Label>Descripción *</Label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={crear} disabled={guardando}>
            {guardando ? 'Creando...' : 'Crear reclamo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
