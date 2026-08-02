export type EstadoPedido =
  | 'PENDIENTE'
  | 'PREPARANDO'
  | 'EMPAQUETADO'
  | 'DESPACHADO'
  | 'EN_VIAJE'
  | 'ENTREGADO'
  | 'CANCELADO'
  | 'DEVUELTO';

export interface EstadoHistorial {
  id: string;
  estado: EstadoPedido;
  comentario: string | null;
  createdAt: string;
}

export interface Seguimiento {
  id: string;
  transportista: string | null;
  numeroTracking: string | null;
  urlTracking: string | null;
  createdAt: string;
}

export interface PedidoResumen {
  id: string;
  numeroPedido: string;
  total: string | number;
  createdAt: string;
  cliente: { id: string; nombre: string | null; telefono: string | null };
  estados: { estado: EstadoPedido }[];
}

export interface PedidoItem {
  id: string;
  cantidad: number;
  precioUnitario: string | number;
  subtotal: string | number;
  variante: {
    color: string | null;
    talle: string | null;
    producto: { nombre: string };
  };
}

export interface PedidoDetalle {
  id: string;
  numeroPedido: string;
  subtotal: string | number;
  descuentoTotal: string | number;
  envio: string | number;
  total: string | number;
  createdAt: string;
  cliente: { id: string; nombre: string | null; telefono: string | null };
  items: PedidoItem[];
  estados: EstadoHistorial[];
  seguimiento: Seguimiento[];
}
