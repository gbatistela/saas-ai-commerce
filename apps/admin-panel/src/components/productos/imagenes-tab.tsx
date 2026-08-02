'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/file-uploader';
import { apiClientFetch } from '@/lib/api-client';
import type { ArchivoProducto } from './types';

export function ImagenesTab({
  productoId,
  archivos,
  onCambio,
}: {
  productoId: string;
  archivos: ArchivoProducto[];
  onCambio: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function onUploaded(url: string, contentType: string) {
    setError(null);
    try {
      await apiClientFetch(`/productos/${productoId}/archivos`, {
        method: 'POST',
        body: JSON.stringify({
          url,
          tipoMime: contentType,
          tipo: 'IMAGEN',
          orden: archivos.length,
        }),
      });
      onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar la imagen');
    }
  }

  async function eliminar(archivoId: string) {
    setError(null);
    try {
      await apiClientFetch(`/archivos/${archivoId}`, { method: 'DELETE' });
      onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar la imagen');
    }
  }

  return (
    <div className="space-y-4">
      {archivos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no cargaste imágenes.</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {archivos.map((a) => (
            <div key={a.id} className="group relative aspect-square overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.archivo.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => eliminar(a.id)}
                className="absolute right-1 top-1 hidden rounded-full bg-background/90 p-1 text-destructive shadow group-hover:block"
                aria-label="Eliminar imagen"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <FileUploader carpeta="productos" onUploaded={onUploaded} label="Subir imagen" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
