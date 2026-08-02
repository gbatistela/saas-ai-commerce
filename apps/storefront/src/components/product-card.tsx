import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatMoneda } from '@/lib/format';
import type { ProductoResumen } from '@/lib/types';

export function ProductCard({ slug, producto }: { slug: string; producto: ProductoResumen }) {
  const sinStock = producto.stockTotal <= 0;

  return (
    <Link href={`/${slug}/productos/${producto.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        {producto.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagenUrl}
            alt={producto.nombre}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-secondary text-4xl text-muted-foreground">
            🛍️
          </div>
        )}
        <div className="space-y-1 p-3">
          <p className="line-clamp-1 text-sm font-medium">{producto.nombre}</p>
          {producto.marca && (
            <p className="text-xs text-muted-foreground">{producto.marca.nombre}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="font-semibold">{formatMoneda(Number(producto.precio))}</p>
            {sinStock && <span className="text-xs text-destructive">Sin stock</span>}
          </div>
        </div>
      </Card>
    </Link>
  );
}
