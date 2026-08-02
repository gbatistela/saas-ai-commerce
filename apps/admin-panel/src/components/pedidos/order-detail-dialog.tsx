'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, Truck, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClientFetch } from '@/lib/api-client';
import { formatMoneda } from '@/lib/format';
import { ESTADO_BADGE, ESTADO_LABEL, esCancelable, siguienteEstado } from './estado';
import type { PedidoDetalle } from './types';

export function OrderDetailDialog({
  pedidoId,
  onOpenChange,
  onCambio,
}: {
  pedidoId: string | null;
  onOpenChange: (open: boolean) => void;
  onCambio: () => void;
}) {
  const [detalle, setDetalle] = useState<PedidoDetalle | null>(null);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seguimientoForm, setSeguimientoForm] = useState({
    transportista: '',
    numeroTracking: '',
    urlTracking: '',
  });

  const cargar = async () => {
    if (!pedidoId) return;
    const d = await apiClientFetch<PedidoDetalle>(`/pedidos/${pedidoId}`);
    setDetalle(d);
  };

  useEffect(() => {
    setDetalle(null);
    setError(null);
    if (pedidoId) cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoId]);

  async function cambiarEstado(estado: string) {
    if (!pedidoId) return;
    setActualizando(true);
    setError(null);
    try {
      await apiClientFetch(`/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
      await cargar();
      onCambio();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar el estado');
    } finally {
      setActualizando(false);
    }
  }

  async function agregarSeguimiento() {
    if (!pedidoId) return;
    setError(null);
    try {
      await apiClientFetch(`/pedidos/${pedidoId}/seguimiento`, {
        method: 'POST',
        body: JSON.stringify({
          transportista: seguimientoForm.transportista || undefined,
          numeroTracking: seguimientoForm.numeroTracking || undefined,
          urlTracking: seguimientoForm.urlTracking || undefined,
        }),
      });
      setSeguimientoForm({ transportista: '', numeroTracking: '', urlTracking: '' });
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo agregar el seguimiento');
    }
  }

  const estadoActual = detalle?.estados[0]?.estado ?? 'PENDIENTE';
  const proximo = siguienteEstado(estadoActual);

  return (
    <Dialog open={Boolean(pedidoId)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {!detalle ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <DialogTitle>Pedido #{detalle.numeroPedido}</DialogTitle>
                <Badge variant={ESTADO_BADGE[estadoActual]}>{ESTADO_LABEL[estadoActual]}</Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Cliente</p>
                <p>{detalle.cliente.nombre || detalle.cliente.telefono}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Total</p>
                <p className="font-medium">{formatMoneda(Number(detalle.total))}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs font-medium uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Producto</th>
                    <th className="px-3 py-2">Cant.</th>
                    <th className="px-3 py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detalle.items.map((i) => (
                    <tr key={i.id}>
                      <td className="px-3 py-2">
                        {i.variante.producto.nombre}
                        {(i.variante.color || i.variante.talle) && (
                          <span className="text-muted-foreground">
                            {' '}
                            ({[i.variante.color, i.variante.talle].filter(Boolean).join(' / ')})
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">{i.cantidad}</td>
                      <td className="px-3 py-2">{formatMoneda(Number(i.subtotal))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Historial de estados
              </p>
              <ol className="space-y-2 border-l border-border pl-4">
                {detalle.estados.map((e) => (
                  <li key={e.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="font-medium">{ESTADO_LABEL[e.estado]}</span>{' '}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true, locale: es })}
                    </span>
                    {e.comentario && <p className="text-xs text-muted-foreground">{e.comentario}</p>}
                  </li>
                ))}
              </ol>
            </div>

            {detalle.seguimiento.length > 0 && (
              <div className="space-y-1.5 rounded-lg border border-border p-3 text-sm">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" /> Seguimiento
                </p>
                {detalle.seguimiento.map((s) => (
                  <p key={s.id}>
                    {s.transportista} — {s.numeroTracking}
                  </p>
                ))}
              </div>
            )}

            {estadoActual !== 'CANCELADO' && estadoActual !== 'DEVUELTO' && (
              <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Agregar seguimiento de envío
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Transportista</Label>
                    <Input
                      value={seguimientoForm.transportista}
                      onChange={(e) =>
                        setSeguimientoForm((f) => ({ ...f, transportista: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">N° Tracking</Label>
                    <Input
                      value={seguimientoForm.numeroTracking}
                      onChange={(e) =>
                        setSeguimientoForm((f) => ({ ...f, numeroTracking: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={seguimientoForm.urlTracking}
                      onChange={(e) =>
                        setSeguimientoForm((f) => ({ ...f, urlTracking: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={agregarSeguimiento}>
                  Agregar
                </Button>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              {esCancelable(estadoActual) && (
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  disabled={actualizando}
                  onClick={() => cambiarEstado('CANCELADO')}
                >
                  <XCircle className="h-4 w-4" /> Cancelar pedido
                </Button>
              )}
              {proximo && (
                <Button disabled={actualizando} onClick={() => cambiarEstado(proximo)}>
                  Avanzar a {ESTADO_LABEL[proximo]} <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
