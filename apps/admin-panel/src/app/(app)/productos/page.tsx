import { apiFetch } from '@/lib/api-server';
import { ProductsTable } from '@/components/productos/products-table';
import type { Categoria, Marca, ProductoResumen } from '@/components/productos/types';

export default async function ProductosPage() {
  const [productos, categorias, marcas] = await Promise.all([
    apiFetch<{ data: ProductoResumen[] }>('/productos?limit=100'),
    apiFetch<Categoria[]>('/categorias'),
    apiFetch<Marca[]>('/marcas'),
  ]);

  return (
    <ProductsTable
      productosIniciales={productos.data}
      categorias={categorias}
      marcas={marcas}
    />
  );
}
