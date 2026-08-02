import { Search, ShoppingBag } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import type { ProductoResumen } from '@/lib/types';

export default async function TiendaPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { texto?: string };
}) {
  const qs = searchParams.texto ? `?texto=${encodeURIComponent(searchParams.texto)}` : '';
  const { data: productos } = await apiFetch<{ data: ProductoResumen[] }>(
    `/storefront/${params.slug}/productos${qs}`,
  );

  return (
    <div className="space-y-6">
      <form className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          name="texto"
          defaultValue={searchParams.texto}
          placeholder="Buscar productos..."
          className="w-full rounded-md border border-input bg-transparent py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </form>

      {productos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            {searchParams.texto ? 'Sin resultados para esa búsqueda.' : 'Todavía no hay productos cargados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((p) => (
            <ProductCard key={p.id} slug={params.slug} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
