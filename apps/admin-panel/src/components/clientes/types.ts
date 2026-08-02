export interface ClienteResumen {
  id: string;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  canalOrigen: string;
  esFrecuente: boolean;
  createdAt: string;
}

export interface Direccion {
  id: string;
  calle: string;
  numero: string | null;
  ciudad: string;
  esPrincipal: boolean;
}

export interface PedidoResumenCliente {
  id: string;
  numeroPedido: string;
  total: string | number;
  createdAt: string;
  estados: { estado: string }[];
}

export interface ClienteFicha extends ClienteResumen {
  talleP: string | null;
  colorPreferido: string | null;
  marcaPreferida: string | null;
  metodoPagoPreferido: string | null;
  presupuestoEstimado: string | number | null;
  notasIA: string | null;
  direcciones: Direccion[];
  etiquetas: { etiqueta: { id: string; nombre: string } }[];
  pedidos: PedidoResumenCliente[];
}

export interface ConversacionResumenCliente {
  id: string;
  canal: string;
  estado: string;
  ultimoMensajeAt: string | null;
}

export interface ReclamoResumenCliente {
  id: string;
  tipo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  createdAt: string;
}
