import type { EstadoReclamo, PrioridadReclamo } from './types';

export const COLUMNAS: { estado: EstadoReclamo; label: string }[] = [
  { estado: 'ABIERTO', label: 'Abierto' },
  { estado: 'EN_PROCESO', label: 'En proceso' },
  { estado: 'RESUELTO', label: 'Resuelto' },
  { estado: 'ESCALADO', label: 'Escalado' },
  { estado: 'CERRADO', label: 'Cerrado' },
];

export const PRIORIDAD_COLOR: Record<PrioridadReclamo, string> = {
  BAJA: 'bg-muted-foreground',
  MEDIA: 'bg-primary',
  ALTA: 'bg-warning',
  URGENTE: 'bg-destructive',
};

export const PRIORIDAD_LABEL: Record<PrioridadReclamo, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
};
