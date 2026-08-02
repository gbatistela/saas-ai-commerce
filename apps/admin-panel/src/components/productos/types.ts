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
  costo: string | number | null;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  destacado: boolean;
  categoria: Categoria | null;
  marca: Marca | null;
  stockTotal: number;
  stockBajo: boolean;
  imagenUrl: string | null;
}

export interface Stock {
  id: string;
  deposito: string;
  cantidad: number;
  stockMinimo: number;
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

export interface Relacionado {
  id: string;
  tipo: 'SIMILAR' | 'COMPLEMENTARIO' | 'COMBO';
  relacionado: { id: string; nombre: string };
}

export interface ArchivoProducto {
  id: string;
  tipo: 'IMAGEN' | 'VIDEO' | 'DOCUMENTO';
  orden: number;
  archivo: { id: string; url: string; tipoMime: string };
}

export interface ProductoDetalle
  extends Omit<ProductoResumen, 'stockTotal' | 'stockBajo' | 'imagenUrl'> {
  descripcion: string | null;
  categoriaId: string | null;
  marcaId: string | null;
  variantes: Variante[];
  relacionadosDesde: Relacionado[];
  archivos: ArchivoProducto[];
}
