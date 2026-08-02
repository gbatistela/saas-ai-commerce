'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Package, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiClientFetch } from '@/lib/api-client';
import { formatMoneda } from '@/lib/format';
import { ProductFormDialog } from './product-form-dialog';
import type { Categoria, Marca, ProductoResumen } from './types';

const ESTADO_VARIANT: Record<ProductoResumen['estado'], 'success' | 'secondary' | 'destructive'> = {
  ACTIVO: 'success',
  INACTIVO: 'secondary',
  SUSPENDIDO: 'destructive',
};

export function ProductsTable({
  productosIniciales,
  categorias,
  marcas,
}: {
  productosIniciales: ProductoResumen[];
  categorias: Categoria[];
  marcas: Marca[];
}) {
  const [productos, setProductos] = useState(productosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [productoEditandoId, setProductoEditandoId] = useState<string | null>(null);

  const recargar = useCallback(async (texto?: string) => {
    const qs = texto ? `?texto=${encodeURIComponent(texto)}` : '';
    const res = await apiClientFetch<{ data: ProductoResumen[] }>(`/productos${qs}`);
    setProductos(res.data);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => recargar(busqueda || undefined), 350);
    return () => clearTimeout(id);
  }, [busqueda, recargar]);

  function abrirNuevo() {
    setProductoEditandoId(null);
    setDialogAbierto(true);
  }

  function abrirEdicion(id: string) {
    setProductoEditandoId(id);
    setDialogAbierto(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
        <Button onClick={abrirNuevo}>
          <Plus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o SKU..."
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        {productos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Package className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {busqueda ? 'Sin resultados para esa búsqueda.' : 'Todavía no cargaste productos.'}
            </p>
            {!busqueda && (
              <Button variant="outline" size="sm" onClick={abrirNuevo}>
                Cargar el primero
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-medium uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Nombre</th>
                <th className="px-4 py-2.5">Categoría</th>
                <th className="px-4 py-2.5">Precio</th>
                <th className="px-4 py-2.5">Stock</th>
                <th className="px-4 py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productos.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => abrirEdicion(p.id)}
                  className="cursor-pointer hover:bg-accent/50"
                >
                  <td className="px-4 py-2.5">
                    <p className="font-medium">{p.nombre}</p>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {p.categoria?.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-2.5">{formatMoneda(Number(p.precio))}</td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-1">
                      {p.stockTotal}
                      {p.stockBajo && (
                        <AlertTriangle className="h-3.5 w-3.5 text-warning" aria-label="Stock bajo" />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={ESTADO_VARIANT[p.estado]}>{p.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProductFormDialog
        open={dialogAbierto}
        onOpenChange={setDialogAbierto}
        productoId={productoEditandoId}
        categorias={categorias}
        marcas={marcas}
        onGuardado={() => recargar(busqueda || undefined)}
      />
    </div>
  );
}
