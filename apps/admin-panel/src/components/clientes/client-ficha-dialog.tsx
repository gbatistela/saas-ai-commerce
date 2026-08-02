'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPin, MessageSquare, Package, Save, Star, Ticket } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClientFetch } from '@/lib/api-client';
import { formatMoneda } from '@/lib/format';
import type {
  ClienteFicha,
  ConversacionResumenCliente,
  ReclamoResumenCliente,
} from './types';

export function ClientFichaDialog({
  clienteId,
  onOpenChange,
}: {
  clienteId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [ficha, setFicha] = useState<ClienteFicha | null>(null);
  const [conversaciones, setConversaciones] = useState<ConversacionResumenCliente[]>([]);
  const [reclamos, setReclamos] = useState<ReclamoResumenCliente[]>([]);
  const [memoria, setMemoria] = useState({
    talleP: '',
    colorPreferido: '',
    marcaPreferida: '',
    metodoPagoPreferido: '',
    notasIA: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clienteId) {
      setFicha(null);
      return;
    }
    setFicha(null);
    setError(null);

    apiClientFetch<ClienteFicha>(`/clientes/${clienteId}`).then((f) => {
      setFicha(f);
      setMemoria({
        talleP: f.talleP ?? '',
        colorPreferido: f.colorPreferido ?? '',
        marcaPreferida: f.marcaPreferida ?? '',
        metodoPagoPreferido: f.metodoPagoPreferido ?? '',
        notasIA: f.notasIA ?? '',
      });
    });

    apiClientFetch<{ data: ConversacionResumenCliente[] }>(
      `/conversaciones?cliente=${clienteId}&limit=10`,
    )
      .then((r) => setConversaciones(r.data))
      .catch(() => setConversaciones([]));

    apiClientFetch<{ data: ReclamoResumenCliente[] }>(`/reclamos?cliente=${clienteId}&limit=10`)
      .then((r) => setReclamos(r.data))
      .catch(() => setReclamos([]));
  }, [clienteId]);

  async function guardarMemoria() {
    if (!clienteId) return;
    setGuardando(true);
    setError(null);
    try {
      const payload = Object.fromEntries(
        Object.entries(memoria).filter(([, v]) => v.trim() !== ''),
      );
      await apiClientFetch(`/clientes/${clienteId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Dialog open={Boolean(clienteId)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {!ficha ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 pr-6">
                <DialogTitle>{ficha.nombre || 'Sin nombre'}</DialogTitle>
                {ficha.esFrecuente && (
                  <Badge variant="success" className="gap-1">
                    <Star className="h-3 w-3" /> Frecuente
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Teléfono</p>
                <p>{ficha.telefono || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Email</p>
                <p>{ficha.email || '—'}</p>
              </div>
            </div>

            {ficha.direcciones.length > 0 && (
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Direcciones
                </p>
                {ficha.direcciones.map((d) => (
                  <p key={d.id}>
                    {d.calle} {d.numero}, {d.ciudad}
                    {d.esPrincipal && <Badge className="ml-2">Principal</Badge>}
                  </p>
                ))}
              </div>
            )}

            <div className="space-y-2 rounded-lg border border-border p-3">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Memoria (detectado por IA — editable)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Talle</Label>
                  <Input
                    value={memoria.talleP}
                    onChange={(e) => setMemoria((m) => ({ ...m, talleP: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Color preferido</Label>
                  <Input
                    value={memoria.colorPreferido}
                    onChange={(e) => setMemoria((m) => ({ ...m, colorPreferido: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Marca preferida</Label>
                  <Input
                    value={memoria.marcaPreferida}
                    onChange={(e) => setMemoria((m) => ({ ...m, marcaPreferida: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Método de pago</Label>
                  <Input
                    value={memoria.metodoPagoPreferido}
                    onChange={(e) =>
                      setMemoria((m) => ({ ...m, metodoPagoPreferido: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Notas</Label>
                  <Input
                    value={memoria.notasIA}
                    onChange={(e) => setMemoria((m) => ({ ...m, notasIA: e.target.value }))}
                  />
                </div>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button size="sm" variant="outline" onClick={guardarMemoria} disabled={guardando}>
                <Save className="h-3.5 w-3.5" /> Guardar memoria
              </Button>
            </div>

            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <Package className="h-3.5 w-3.5" /> Pedidos ({ficha.pedidos.length})
              </p>
              {ficha.pedidos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin pedidos.</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {ficha.pedidos.map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span>#{p.numeroPedido}</span>
                      <span className="text-muted-foreground">{formatMoneda(Number(p.total))}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" /> Conversaciones ({conversaciones.length})
              </p>
              {conversaciones.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin conversaciones.</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {conversaciones.map((c) => (
                    <li key={c.id} className="flex justify-between">
                      <span>{c.canal}</span>
                      <span className="text-muted-foreground">
                        {c.ultimoMensajeAt &&
                          formatDistanceToNow(new Date(c.ultimoMensajeAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <Ticket className="h-3.5 w-3.5" /> Reclamos ({reclamos.length})
              </p>
              {reclamos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin reclamos.</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {reclamos.map((r) => (
                    <li key={r.id} className="flex justify-between">
                      <span className="truncate">{r.descripcion}</span>
                      <Badge variant="outline">{r.estado}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
