'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { ConversacionResumen } from './types';

const ESTADO_DOT: Record<ConversacionResumen['estado'], string> = {
  ABIERTA: 'bg-success',
  HANDOFF: 'bg-warning',
  CERRADA: 'bg-muted-foreground',
};

export function ConversationListItem({
  conversacion,
  activa,
  onClick,
}: {
  conversacion: ConversacionResumen;
  activa: boolean;
  onClick: () => void;
}) {
  const ultimoMensaje = conversacion.mensajes[0]?.contenido ?? 'Sin mensajes';

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-0.5 border-b border-border px-3 py-2.5 text-left transition-colors hover:bg-accent',
        activa && 'bg-accent',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 truncate text-sm font-medium">
          <span className={cn('h-2 w-2 shrink-0 rounded-full', ESTADO_DOT[conversacion.estado])} />
          {conversacion.cliente.nombre || conversacion.cliente.telefono || 'Sin nombre'}
        </span>
        {conversacion.ultimoMensajeAt && (
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatDistanceToNowStrict(new Date(conversacion.ultimoMensajeAt), { locale: es })}
          </span>
        )}
      </div>
      <p className="truncate pl-3.5 text-xs text-muted-foreground">{ultimoMensaje}</p>
    </button>
  );
}
