'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { apiClientFetch } from '@/lib/api-client';
import { formatMoneda } from '@/lib/format';
import { ESTADO_BADGE, ESTADO_LABEL } from './estado';
import { OrderDetailDialog } from './order-detail-dialog';
import type { EstadoPedido, PedidoResumen } from './types';

const FILTROS: { value: EstadoPedido | 'TODOS'; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'PREPARANDO', label: 'Preparando' },
  { value: 'DESPACHADO', label: 'Despachado' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

export function PedidosTable({ pedidosIniciales }: { pedidosIniciales: PedidoResumen[] }) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [filtro, setFiltro] = useState<EstadoPedido | 'TODOS'>('TODOS');
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const recargar = useCallback(async (estado: EstadoPedido | 'TODOS') => {
    const qs = estado !== 'TODOS' ? `?estado=${estado}` : '';
    const res = await apiClientFetch<{ data: PedidoResumen[] }>(`/pedidos${qs}`);
    setPedidos(res.data);
  }, []);

  useEffect(() => {
    recargar(filtro);
  }, [filtro, recargar]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>

      <div className="flex flex-wrap gap-1.5">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filtro === f.value
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border text-muted-foreground hover:bg-accent',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Package className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Sin pedidos en este filtro.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-medium uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">N° Pedido</th>
                <th className="px-4 py-2.5">Cliente</th>
                <th className="px-4 py-2.5">Total</th>
                <th className="px-4 py-2.5">Estado</th>
                <th className="px-4 py-2.5">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pedidos.map((p) => {
                const estado = p.estados[0]?.estado ?? 'PENDIENTE';
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSeleccionado(p.id)}
                    className="cursor-pointer hover:bg-accent/50"
                  >
                    <td className="px-4 py-2.5 font-medium">#{p.numeroPedido}</td>
                    <td className="px-4 py-2.5">{p.cliente.nombre || p.cliente.telefono}</td>
                    <td className="px-4 py-2.5">{formatMoneda(Number(p.total))}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={ESTADO_BADGE[estado]}>{ESTADO_LABEL[estado]}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true, locale: es })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <OrderDetailDialog
        pedidoId={seleccionado}
        onOpenChange={(open) => !open && setSeleccionado(null)}
        onCambio={() => recargar(filtro)}
      />
    </div>
  );
}
