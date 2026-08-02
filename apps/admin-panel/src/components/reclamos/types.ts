export type EstadoReclamo = 'ABIERTO' | 'EN_PROCESO' | 'RESUELTO' | 'ESCALADO' | 'CERRADO';
export type PrioridadReclamo = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface ReclamoResumen {
  id: string;
  tipo: string;
  descripcion: string;
  estado: EstadoReclamo;
  prioridad: PrioridadReclamo;
  createdAt: string;
  cliente: { id: string; nombre: string | null; telefono: string | null };
  asignadoAId: string | null;
}

export interface Archivo {
  id: string;
  url: string;
  tipoMime: string;
}

export interface ArchivoReclamo {
  id: string;
  tipo: string;
  archivo: Archivo;
}

export interface ReclamoDetalle extends ReclamoResumen {
  pedido: { id: string; numeroPedido: string } | null;
  archivos: ArchivoReclamo[];
}

export interface ClienteBusqueda {
  id: string;
  nombre: string | null;
  telefono: string | null;
}
