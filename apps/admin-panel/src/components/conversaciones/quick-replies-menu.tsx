'use client';

import { useEffect, useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClientFetch } from '@/lib/api-client';

export interface RespuestaRapida {
  id: string;
  atajo: string;
  contenido: string;
}

export function QuickRepliesMenu({
  onSeleccionar,
  disabled,
}: {
  onSeleccionar: (contenido: string) => void;
  disabled?: boolean;
}) {
  const [respuestas, setRespuestas] = useState<RespuestaRapida[]>([]);
  const [cargado, setCargado] = useState(false);
  const [creando, setCreando] = useState(false);
  const [nuevoAtajo, setNuevoAtajo] = useState('');
  const [nuevoContenido, setNuevoContenido] = useState('');
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    apiClientFetch<RespuestaRapida[]>('/respuestas-rapidas')
      .then((data) => {
        setRespuestas(data);
        setCargado(true);
      })
      .catch(() => setCargado(true));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function guardarNueva() {
    if (!nuevoAtajo.trim() || !nuevoContenido.trim()) return;
    setError(null);
    try {
      await apiClientFetch('/respuestas-rapidas', {
        method: 'POST',
        body: JSON.stringify({
          atajo: nuevoAtajo.trim(),
          contenido: nuevoContenido.trim(),
        }),
      });
      setNuevoAtajo('');
      setNuevoContenido('');
      setCreando(false);
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la respuesta rápida');
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && cargar()}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="icon" title="Respuestas rápidas" disabled={disabled}>
          <Zap className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Respuestas rápidas</DropdownMenuLabel>
        {cargado && respuestas.length === 0 && !creando && (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Todavía no cargaste ninguna.
          </p>
        )}
        <div className="max-h-56 overflow-y-auto">
          {respuestas.map((r) => (
            <DropdownMenuItem
              key={r.id}
              onSelect={() => onSeleccionar(r.contenido)}
              className="flex-col items-start gap-0.5"
            >
              <span className="font-medium text-primary">{r.atajo}</span>
              <span className="line-clamp-1 text-xs text-muted-foreground">{r.contenido}</span>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        {creando ? (
          <div className="space-y-1.5 p-2" onKeyDown={(e) => e.stopPropagation()}>
            <Input
              value={nuevoAtajo}
              onChange={(e) => setNuevoAtajo(e.target.value)}
              placeholder="/atajo"
              className="h-7 text-xs"
            />
            <textarea
              value={nuevoContenido}
              onChange={(e) => setNuevoContenido(e.target.value)}
              placeholder="Contenido de la respuesta..."
              rows={2}
              className="w-full resize-none rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {error && <p className="text-[10px] text-destructive">{error}</p>}
            <div className="flex justify-end gap-1.5">
              <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setCreando(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="h-6 text-xs" onClick={guardarNueva}>
                Guardar
              </Button>
            </div>
          </div>
        ) : (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCreando(true); }}>
            <Plus className="h-3.5 w-3.5" /> Nueva respuesta rápida
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
