export interface EmpresaInfo {
  nombre: string;
  logoUrl: string | null;
  moneda: string;
  rubro: string | null;
}

export interface Categoria {
  id: string;
  nombre: string;
  categoriaPadreId: string | null;
  subcategorias?: Categoria[];
}

export interface Marca {
  id: string;
  nombre: string;
}

export interface ProductoResumen {
  id: string;
  nombre: string;
  sku: string;
  precio: string | number;
  estado: string;
  categoria: Categoria | null;
  marca: Marca | null;
  stockTotal: number;
  imagenUrl: string | null;
}

export interface Stock {
  cantidad: number;
}

export interface Variante {
  id: string;
  color: string | null;
  talle: string | null;
  skuVariante: string;
  precioAdicional: string | number;
  imagenUrl: string | null;
  stock: Stock[];
}

export interface ArchivoProducto {
  archivo: { url: string; tipoMime: string };
}

export interface ProductoDetalle extends Omit<ProductoResumen, 'stockTotal'> {
  descripcion: string | null;
  variantes: Variante[];
  archivos: ArchivoProducto[];
}

export interface CarritoItem {
  id: string;
  varianteId: string;
  cantidad: number;
  precioUnitario: string | number;
  variante: {
    color: string | null;
    talle: string | null;
    skuVariante: string;
    producto: { nombre: string };
    stock: Stock[];
  };
}

export interface Carrito {
  id: string;
  estado: string;
  items: CarritoItem[];
}

export interface EstadoHistorial {
  id: string;
  estado: string;
  comentario: string | null;
  createdAt: string;
}

export interface Seguimiento {
  id: string;
  transportista: string | null;
  numeroTracking: string | null;
  urlTracking: string | null;
}

export interface EstadoPedidoPublico {
  numeroPedido: string;
  estadoActual: string | null;
  historial: EstadoHistorial[];
  seguimiento: Seguimiento[];
  total: string | number;
}
