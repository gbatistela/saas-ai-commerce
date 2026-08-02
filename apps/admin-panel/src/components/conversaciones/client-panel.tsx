'use client';

import { Package, Star, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoneda } from '@/lib/format';
import type { ClienteDetalle } from './types';

function iniciales(nombre: string | null, telefono: string | null) {
  const base = nombre || telefono || '?';
  return base
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function ClientPanel({ cliente }: { cliente: ClienteDetalle | null }) {
  if (!cliente) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const preferencias = [
    cliente.talleP && { label: 'Talle', valor: cliente.talleP },
    cliente.colorPreferido && { label: 'Color fav.', valor: cliente.colorPreferido },
    cliente.marcaPreferida && { label: 'Marca fav.', valor: cliente.marcaPreferida },
    cliente.metodoPagoPreferido && { label: 'Pago', valor: cliente.metodoPagoPreferido },
    cliente.presupuestoEstimado && {
      label: 'Presupuesto',
      valor: formatMoneda(Number(cliente.presupuestoEstimado)),
    },
  ].filter((v): v is { label: string; valor: string } => Boolean(v));

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="flex flex-col items-center gap-2 pb-4 text-center">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {iniciales(cliente.nombre, cliente.telefono)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="flex items-center justify-center gap-1 font-medium">
            <User className="h-3.5 w-3.5" />
            {cliente.nombre || 'Sin nombre'}
          </p>
          <p className="text-sm text-muted-foreground">{cliente.telefono}</p>
        </div>
        {cliente.esFrecuente && (
          <Badge variant="success" className="gap-1">
            <Star className="h-3 w-3" /> Cliente frecuente
          </Badge>
        )}
      </div>

      {preferencias.length > 0 && (
        <div className="space-y-2 border-t border-border py-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Memoria (detectado por IA)
          </p>
          {preferencias.map((p) => (
            <div key={p.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{p.label}</span>
              <span className="font-medium">{p.valor}</span>
            </div>
          ))}
          {cliente.notasIA && (
            <p className="rounded-md bg-muted px-2 py-1.5 text-xs text-muted-foreground">
              {cliente.notasIA}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2 border-t border-border py-4">
        <p className="flex items-center gap-1 text-xs font-medium uppercase text-muted-foreground">
          <Package className="h-3.5 w-3.5" /> Pedidos recientes ({cliente.pedidos.length})
        </p>
        {cliente.pedidos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin pedidos todavía.</p>
        ) : (
          <ul className="space-y-1.5">
            {cliente.pedidos.slice(0, 5).map((p) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span>#{p.numeroPedido}</span>
                <span className="text-muted-foreground">{formatMoneda(Number(p.total))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
