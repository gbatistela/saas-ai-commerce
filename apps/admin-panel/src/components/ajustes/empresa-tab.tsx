'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClientFetch } from '@/lib/api-client';
import type { EmpresaAjustes } from './types';

export function EmpresaTab({ empresaInicial }: { empresaInicial: EmpresaAjustes }) {
  const [form, setForm] = useState({
    logoUrl: empresaInicial.logoUrl ?? '',
    moneda: empresaInicial.moneda,
    timezone: empresaInicial.timezone,
    telefonoWhatsapp: empresaInicial.telefonoWhatsapp ?? '',
    instagramAccountId: empresaInicial.instagramAccountId ?? '',
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function guardar() {
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      await apiClientFetch('/empresa', {
        method: 'PATCH',
        body: JSON.stringify({
          logoUrl: form.logoUrl || undefined,
          moneda: form.moneda,
          timezone: form.timezone,
          telefonoWhatsapp: form.telefonoWhatsapp || undefined,
          instagramAccountId: form.instagramAccountId || undefined,
        }),
      });
      setMensaje('Cambios guardados.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Datos de la empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>URL del logo</Label>
            <Input
              value={form.logoUrl}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Moneda</Label>
              <Input
                value={form.moneda}
                onChange={(e) => setForm((f) => ({ ...f, moneda: e.target.value }))}
                placeholder="ARS"
              />
            </div>
            <div className="space-y-1">
              <Label>Zona horaria</Label>
              <Input
                value={form.timezone}
                onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                placeholder="America/Argentina/Buenos_Aires"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Conexión de canales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Número de WhatsApp (Evolution API)</Label>
            <Input
              value={form.telefonoWhatsapp}
              onChange={(e) => setForm((f) => ({ ...f, telefonoWhatsapp: e.target.value }))}
              placeholder="+54 9 11 ..."
            />
            <p className="text-xs text-muted-foreground">
              La instancia de Evolution API tiene que llamarse{' '}
              <code className="rounded bg-muted px-1">{empresaInicial.slug}</code> para que los
              mensajes entrantes se asocien a esta empresa.
            </p>
          </div>
          <div className="space-y-1">
            <Label>Instagram Business Account ID</Label>
            <Input
              value={form.instagramAccountId}
              onChange={(e) => setForm((f) => ({ ...f, instagramAccountId: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Se obtiene al conectar la cuenta de Instagram vía Meta for Developers.
            </p>
          </div>
        </CardContent>
      </Card>

      {mensaje && <p className="text-sm text-success">{mensaje}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={guardar} disabled={guardando}>
        <Save className="h-4 w-4" /> {guardando ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </div>
  );
}
