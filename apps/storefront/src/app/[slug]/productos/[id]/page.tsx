import { notFound } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { AddToCartForm } from '@/components/add-to-cart-form';
import type { ProductoDetalle } from '@/lib/types';

export default async function ProductoPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  let producto: ProductoDetalle;
  try {
    producto = await apiFetch<ProductoDetalle>(`/storefront/${params.slug}/productos/${params.id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex aspect-square items-center justify-center rounded-xl bg-secondary text-8xl">
        🛍️
      </div>

      <div className="space-y-4">
        <div>
          {producto.marca && (
            <p className="text-sm text-muted-foreground">{producto.marca.nombre}</p>
          )}
          <h1 className="text-2xl font-semibold">{producto.nombre}</h1>
        </div>

        {producto.descripcion && (
          <p className="text-sm text-muted-foreground">{producto.descripcion}</p>
        )}

        <AddToCartForm slug={params.slug} producto={producto} />
      </div>
    </div>
  );
}
