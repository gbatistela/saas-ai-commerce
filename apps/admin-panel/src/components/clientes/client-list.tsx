'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, Star, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { apiClientFetch } from '@/lib/api-client';
import { ClientFichaDialog } from './client-ficha-dialog';
import type { ClienteResumen } from './types';

function iniciales(nombre: string | null, telefono: string | null) {
  const base = nombre || telefono || '?';
  return base
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function ClientList({ clientesIniciales }: { clientesIniciales: ClienteResumen[] }) {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [soloFrecuentes, setSoloFrecuentes] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const recargar = useCallback(async (nombre?: string, frecuentes?: boolean) => {
    const params = new URLSearchParams();
    if (nombre) params.set('nombre', nombre);
    if (frecuentes) params.set('esFrecuente', 'true');
    const qs = params.toString();
    const res = await apiClientFetch<{ data: ClienteResumen[] }>(`/clientes${qs ? `?${qs}` : ''}`);
    setClientes(res.data);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => recargar(busqueda || undefined, soloFrecuentes), 350);
    return () => clearTimeout(id);
  }, [busqueda, soloFrecuentes, recargar]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="pl-9"
          />
        </div>
        <button
          onClick={() => setSoloFrecuentes((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            soloFrecuentes
              ? 'border-primary bg-primary/15 text-primary'
              : 'border-border text-muted-foreground hover:bg-accent',
          )}
        >
          <Star className="h-3.5 w-3.5" /> Frecuentes
        </button>
      </div>

      {clientes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border py-16 text-center">
          <Users className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Sin clientes que coincidan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clientes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSeleccionado(c.id)}
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:bg-accent/50"
            >
              <Avatar>
                <AvatarFallback>{iniciales(c.nombre, c.telefono)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.nombre || 'Sin nombre'}</p>
                <p className="truncate text-xs text-muted-foreground">{c.telefono}</p>
              </div>
              {c.esFrecuente && <Badge variant="success">Frecuente</Badge>}
            </button>
          ))}
        </div>
      )}

      <ClientFichaDialog
        clienteId={seleccionado}
        onOpenChange={(open) => !open && setSeleccionado(null)}
      />
    </div>
  );
}
