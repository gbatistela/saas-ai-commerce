import type { EstadoPedido } from './types';

export const SECUENCIA_ESTADOS: EstadoPedido[] = [
  'PENDIENTE',
  'PREPARANDO',
  'EMPAQUETADO',
  'DESPACHADO',
  'EN_VIAJE',
  'ENTREGADO',
];

export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  PREPARANDO: 'Preparando',
  EMPAQUETADO: 'Empaquetado',
  DESPACHADO: 'Despachado',
  EN_VIAJE: 'En viaje',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
  DEVUELTO: 'Devuelto',
};

export const ESTADO_BADGE: Record<
  EstadoPedido,
  'success' | 'secondary' | 'warning' | 'destructive' | 'default'
> = {
  PENDIENTE: 'secondary',
  PREPARANDO: 'default',
  EMPAQUETADO: 'default',
  DESPACHADO: 'warning',
  EN_VIAJE: 'warning',
  ENTREGADO: 'success',
  CANCELADO: 'destructive',
  DEVUELTO: 'destructive',
};

/** null si ya es terminal (ENTREGADO, CANCELADO, DEVUELTO): no hay "siguiente paso" lineal. */
export function siguienteEstado(actual: EstadoPedido): EstadoPedido | null {
  const idx = SECUENCIA_ESTADOS.indexOf(actual);
  if (idx === -1 || idx === SECUENCIA_ESTADOS.length - 1) return null;
  return SECUENCIA_ESTADOS[idx + 1];
}

export function esCancelable(actual: EstadoPedido): boolean {
  return actual !== 'CANCELADO' && actual !== 'ENTREGADO' && actual !== 'DEVUELTO';
}
