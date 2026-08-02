'use client';

import { useEffect, useState } from 'react';
import { Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUploader } from '@/components/file-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClientFetch } from '@/lib/api-client';
import { COLUMNAS, PRIORIDAD_LABEL } from './estado';
import type { EstadoReclamo, PrioridadReclamo, ReclamoDetalle } from './types';

const PRIORIDADES: PrioridadReclamo[] = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];

export function ReclamoDetailDialog({
  reclamoId,
  onOpenChange,
  onCambio,
}: {
  reclamoId: string | null;
  onOpenChange: (open: boolean) => void;
  onCambio: () => void;
}) {
  const [detalle, setDetalle] = useState<ReclamoDetalle | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDetalle(null);
    setError(null);
    if (reclamoId) {
      apiClientFetch<ReclamoDetalle>(`/reclamos/${reclamoId}`).then(setDetalle);
    }
  }, [reclamoId]);

  async function onArchivoSubido(url: string, contentType: string) {
    if (!reclamoId) return;
    setError(null);
    try {
      await apiClientFetch(`/reclamos/${reclamoId}/archivos`, {
        method: 'POST',
        body: JSON.stringify({ url, tipoMime: contentType, tipo: 'IMAGEN' }),
      });
      const actualizado = await apiClientFetch<ReclamoDetalle>(`/reclamos/${reclamoId}`);
      setDetalle(actualizado);
      onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo adjuntar el archivo');
    }
  }

  async function actualizar(campo: 'estado' | 'prioridad', valor: string) {
    if (!reclamoId) return;
    setGuardando(true);
    setError(null);
    try {
      const actualizado = await apiClientFetch<ReclamoDetalle>(`/reclamos/${reclamoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [campo]: valor }),
      });
      setDetalle(actualizado);
      onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Dialog open={Boolean(reclamoId)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {!detalle ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{detalle.cliente.nombre || detalle.cliente.telefono}</DialogTitle>
            </DialogHeader>

            <div className="space-y-1 text-sm">
              <p className="text-xs font-medium uppercase text-muted-foreground">Tipo</p>
              <p>{detalle.tipo}</p>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-xs font-medium uppercase text-muted-foreground">Descripción</p>
              <p className="whitespace-pre-wrap">{detalle.descripcion}</p>
            </div>

            {detalle.pedido && (
              <div className="space-y-1 text-sm">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Pedido asociado
                </p>
                <p>#{detalle.pedido.numeroPedido}</p>
              </div>
            )}

            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <Paperclip className="h-3.5 w-3.5" /> Adjuntos ({detalle.archivos.length})
              </p>
              {detalle.archivos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {detalle.archivos.map((a) => (
                    <a
                      key={a.id}
                      href={a.archivo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block aspect-square overflow-hidden rounded-md border border-border"
                    >
                      {a.archivo.tipoMime.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.archivo.url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          {a.tipo.toLowerCase()}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
              <FileUploader carpeta="reclamos" onUploaded={onArchivoSubido} label="Adjuntar archivo" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Estado</p>
                <Select
                  value={detalle.estado}
                  onValueChange={(v) => actualizar('estado', v as EstadoReclamo)}
                  disabled={guardando}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMNAS.map((c) => (
                      <SelectItem key={c.estado} value={c.estado}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Prioridad</p>
                <Select
                  value={detalle.prioridad}
                  onValueChange={(v) => actualizar('prioridad', v as PrioridadReclamo)}
                  disabled={guardando}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORIDADES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRIORIDAD_LABEL[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
