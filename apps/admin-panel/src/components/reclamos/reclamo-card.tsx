'use client';

import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRIORIDAD_COLOR, PRIORIDAD_LABEL } from './estado';
import type { ReclamoResumen } from './types';

export function ReclamoCard({
  reclamo,
  onClick,
  onDragStart,
}: {
  reclamo: ReclamoResumen;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="cursor-grab space-y-2 rounded-lg border border-border bg-card p-3 text-sm shadow-sm transition-colors hover:bg-accent/50 active:cursor-grabbing"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium">
          {reclamo.cliente.nombre || reclamo.cliente.telefono}
        </span>
        <span
          className={cn('h-2 w-2 shrink-0 rounded-full', PRIORIDAD_COLOR[reclamo.prioridad])}
          title={PRIORIDAD_LABEL[reclamo.prioridad]}
        />
      </div>
      <p className="line-clamp-2 text-xs text-muted-foreground">{reclamo.descripcion}</p>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{reclamo.tipo}</span>
        <span className="flex items-center gap-1">
          <Paperclip className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
