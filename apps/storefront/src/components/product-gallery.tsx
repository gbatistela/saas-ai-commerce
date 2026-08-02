'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ArchivoProducto } from '@/lib/types';

export function ProductGallery({ nombre, archivos }: { nombre: string; archivos: ArchivoProducto[] }) {
  const [activa, setActiva] = useState(0);
  const imagenes = archivos.filter((a) => a.archivo.tipoMime.startsWith('image/'));

  if (imagenes.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-secondary text-8xl">
        🛍️
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagenes[activa].archivo.url}
        alt={nombre}
        className="aspect-square w-full rounded-xl object-cover"
      />
      {imagenes.length > 1 && (
        <div className="flex gap-2">
          {imagenes.map((img, i) => (
            <button
              key={img.archivo.url}
              type="button"
              onClick={() => setActiva(i)}
              className={cn(
                'h-16 w-16 overflow-hidden rounded-md border',
                i === activa ? 'border-primary' : 'border-border',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.archivo.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
