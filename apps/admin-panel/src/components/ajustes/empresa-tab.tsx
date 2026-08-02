'use client';

import { useState } from 'react';
import { RefreshCw, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiClientFetch } from '@/lib/api-client';
import type { EmpresaAjustes } from './types';

export function EmpresaTab({ empresaInicial }: { empresaInicial: EmpresaAjustes }) {
  const [form, setForm] = useState({
    logoUrl: empresaInicial.logoUrl ?? '',
    moneda: empresaInicial.moneda,
    timezone: empresaInicial.timezone,
    telefonoWhatsapp: empresaInicial.telefonoWhatsapp ?? '',
    instagramAccountId: empresaInicial.instagramAccountId ?? '',
    shopifyShopDomain: empresaInicial.shopifyShopDomain ?? '',
    shopifyAccessToken: '',
    shopifyWebhookSecret: '',
  });
  const [shopifyConectado, setShopifyConectado] = useState(empresaInicial.shopifyConectado);
  const [guardando, setGuardando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
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
          shopifyShopDomain: form.shopifyShopDomain || undefined,
          // Los secretos son de solo escritura: si el campo quedó vacío,
          // no se mandan (no se pisa lo ya guardado con un valor vacío).
          shopifyAccessToken: form.shopifyAccessToken || undefined,
          shopifyWebhookSecret: form.shopifyWebhookSecret || undefined,
        }),
      });
      if (form.shopifyAccessToken) setShopifyConectado(true);
      setForm((f) => ({ ...f, shopifyAccessToken: '', shopifyWebhookSecret: '' }));
      setMensaje('Cambios guardados.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  }

  async function sincronizarShopify() {
    setSincronizando(true);
    setError(null);
    setMensaje(null);
    try {
      const res = await apiClientFetch<{ productosSincronizados: number }>('/shopify/sync', {
        method: 'POST',
      });
      setMensaje(`Sincronizados ${res.productosSincronizados} productos desde Shopify.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo sincronizar con Shopify');
    } finally {
      setSincronizando(false);
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold text-foreground">Shopify</CardTitle>
          <Badge variant={shopifyConectado ? 'success' : 'secondary'}>
            {shopifyConectado ? 'Conectado' : 'Sin conectar'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Shop domain</Label>
            <Input
              value={form.shopifyShopDomain}
              onChange={(e) => setForm((f) => ({ ...f, shopifyShopDomain: e.target.value }))}
              placeholder="mi-tienda.myshopify.com"
            />
          </div>
          <div className="space-y-1">
            <Label>Access token</Label>
            <Input
              type="password"
              value={form.shopifyAccessToken}
              onChange={(e) => setForm((f) => ({ ...f, shopifyAccessToken: e.target.value }))}
              placeholder={shopifyConectado ? '•••••••••••••• (ya configurado)' : 'shpat_...'}
            />
            <p className="text-xs text-muted-foreground">
              Se genera creando una app personalizada en el admin de Shopify (Settings → Apps and
              sales channels → Develop apps) con permisos de lectura de productos y pedidos. Por
              seguridad, una vez guardado no se vuelve a mostrar acá.
            </p>
          </div>
          <div className="space-y-1">
            <Label>Webhook secret (API secret key)</Label>
            <Input
              type="password"
              value={form.shopifyWebhookSecret}
              onChange={(e) => setForm((f) => ({ ...f, shopifyWebhookSecret: e.target.value }))}
              placeholder="Para verificar la firma de los webhooks"
            />
          </div>
          <div className="space-y-1 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Configurar webhooks en Shopify</p>
            <p>
              En Settings → Notifications → Webhooks, agregá estos eventos apuntando a{' '}
              <code className="rounded bg-muted px-1">
                {'{API_URL}'}/api/v1/webhooks/shopify
              </code>
              , formato JSON:
            </p>
            <ul className="list-disc pl-4">
              <li>Product creation / Product update</li>
              <li>Order creation</li>
              <li>Fulfillment creation / Fulfillment update</li>
            </ul>
          </div>
          <Button variant="outline" size="sm" onClick={sincronizarShopify} disabled={sincronizando}>
            <RefreshCw className={sincronizando ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
            {sincronizando ? 'Sincronizando...' : 'Sincronizar catálogo ahora'}
          </Button>
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
