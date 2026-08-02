export type EstadoConversacion = 'ABIERTA' | 'CERRADA' | 'HANDOFF';
export type Canal = 'WHATSAPP' | 'INSTAGRAM' | 'WEB' | 'MANUAL';
export type Emisor = 'CLIENTE' | 'IA' | 'HUMANO';

export interface ConversacionResumen {
  id: string;
  clienteId: string;
  canal: Canal;
  estado: EstadoConversacion;
  asignadoAId: string | null;
  ultimoMensajeAt: string | null;
  createdAt: string;
  cliente: { id: string; nombre: string | null; telefono: string | null };
  asignadoA: { id: string; nombre: string } | null;
  mensajes: { contenido: string | null; emisor: Emisor }[];
}

export interface Mensaje {
  id: string;
  conversacionId: string;
  emisor: Emisor;
  tipo: string;
  contenido: string | null;
  createdAt: string;
}

export interface ConversacionDetalle extends Omit<ConversacionResumen, 'mensajes'> {
  mensajes: { data: Mensaje[]; meta: { total: number } };
}

export interface Pedido {
  id: string;
  numeroPedido: string;
  total: string | number;
  createdAt: string;
  estados: { estado: string }[];
}

export interface ClienteDetalle {
  id: string;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  esFrecuente: boolean;
  talleP: string | null;
  colorPreferido: string | null;
  marcaPreferida: string | null;
  metodoPagoPreferido: string | null;
  presupuestoEstimado: string | number | null;
  notasIA: string | null;
  pedidos: Pedido[];
  etiquetas: { etiqueta: { id: string; nombre: string; color: string | null } }[];
}
