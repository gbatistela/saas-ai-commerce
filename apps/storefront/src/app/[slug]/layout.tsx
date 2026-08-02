import Link from 'next/link';
import { notFound } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { CartBadge } from '@/components/layout/cart-badge';
import type { EmpresaInfo } from '@/lib/types';

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  let empresa: EmpresaInfo;
  try {
    empresa = await apiFetch<EmpresaInfo>(`/storefront/${params.slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link href={`/${params.slug}`} className="text-lg font-semibold tracking-tight">
            {empresa.nombre}
          </Link>
          <CartBadge slug={params.slug} />
        </div>
      </header>

      <main className="container flex-1 py-8">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="container text-center text-xs text-muted-foreground">
          {empresa.nombre} — tienda impulsada por IA
        </div>
      </footer>
    </div>
  );
}
