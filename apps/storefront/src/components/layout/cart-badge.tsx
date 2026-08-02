'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { apiClientFetch } from '@/lib/api-client';
import { getCartSessionId } from '@/lib/cart-session';
import type { Carrito } from '@/lib/types';

export function CartBadge({ slug }: { slug: string }) {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    const sessionId = getCartSessionId();
    if (!sessionId) return;

    apiClientFetch<Carrito>(`/storefront/${slug}/carrito?sessionId=${sessionId}`)
      .then((c) => setCantidad(c.items.reduce((sum, i) => sum + i.cantidad, 0)))
      .catch(() => setCantidad(0));
  }, [slug]);

  return (
    <Link href={`/${slug}/carrito`} className="relative flex items-center gap-1.5 text-sm font-medium">
      <ShoppingBag className="h-5 w-5" />
      {cantidad > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {cantidad}
        </span>
      )}
    </Link>
  );
}
