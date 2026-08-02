'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClientFetch } from '@/lib/api-client';

interface PresignedResponse {
  uploadUrl: string;
  publicUrl: string;
}

const MAX_MB = 10;

export function FileUploader({
  carpeta,
  onUploaded,
  accept = 'image/*',
  label = 'Subir archivo',
}: {
  carpeta: 'productos' | 'reclamos';
  onUploaded: (url: string, contentType: string) => void;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo después
    if (!file) return;

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`El archivo supera los ${MAX_MB}MB`);
      return;
    }

    setSubiendo(true);
    setError(null);
    try {
      const { uploadUrl, publicUrl } = await apiClientFetch<PresignedResponse>(
        '/uploads/presigned',
        {
          method: 'POST',
          body: JSON.stringify({
            carpeta,
            nombreArchivo: file.name,
            contentType: file.type,
          }),
        },
      );

      // Va directo al browser -> MinIO, no pasa por nuestro backend ni por
      // el proxy (que solo maneja JSON).
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!res.ok) throw new Error('No se pudo subir el archivo a almacenamiento');

      onUploaded(publicUrl, file.type);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir el archivo');
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="space-y-1">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onFileSelected}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={subiendo}
        onClick={() => inputRef.current?.click()}
      >
        {subiendo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        {subiendo ? 'Subiendo...' : label}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
