import { CheckCircle2, PackageSearch, Truck } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api';
import { formatMoneda } from '@/lib/format';
import { ContactoForm } from '@/components/contacto-form';
import type { EstadoPedidoPublico } from '@/lib/types';

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PREPARANDO: 'Preparando',
  EMPAQUETADO: 'Empaquetado',
  DESPACHADO: 'Despachado',
  EN_VIAJE: 'En viaje',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
  DEVUELTO: 'Devuelto',
};

export default async function EstadoPedidoPage({
  params,
  searchParams,
}: {
  params: { slug: string; numero: string };
  searchParams: { contacto?: string; recienCreado?: string };
}) {
  if (!searchParams.contacto) {
    return <ContactoForm slug={params.slug} numero={params.numero} />;
  }

  let pedido: EstadoPedidoPublico;
  try {
    pedido = await apiFetch<EstadoPedidoPublico>(
      `/storefront/${params.slug}/pedidos/${params.numero}?contacto=${encodeURIComponent(searchParams.contacto)}`,
    );
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return (
        <div className="mx-auto max-w-sm space-y-4 text-center">
          <p className="text-sm text-destructive">
            No encontramos ese pedido con ese teléfono o email.
          </p>
          <ContactoForm slug={params.slug} numero={params.numero} />
        </div>
      );
    }
    throw e;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-2 text-success">
        <CheckCircle2 className="h-6 w-6" />
        <h1 className="text-2xl font-semibold text-foreground">Pedido #{pedido.numeroPedido}</h1>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-4">
        <span className="text-sm text-muted-foreground">Estado actual</span>
        <span className="font-medium">
          {pedido.estadoActual ? ESTADO_LABEL[pedido.estadoActual] : '—'}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-4">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-semibold">{formatMoneda(Number(pedido.total))}</span>
      </div>

      {pedido.seguimiento.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border p-4">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Truck className="h-4 w-4" /> Seguimiento de envío
          </p>
          {pedido.seguimiento.map((s) => (
            <p key={s.id} className="text-sm text-muted-foreground">
              {s.transportista} — {s.numeroTracking}
            </p>
          ))}
        </div>
      )}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
          <PackageSearch className="h-4 w-4" /> Historial
        </p>
        <ol className="space-y-2 border-l border-border pl-4">
          {pedido.historial.map((h) => (
            <li key={h.id} className="relative text-sm">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="font-medium">{ESTADO_LABEL[h.estado] ?? h.estado}</span>{' '}
              <span className="text-xs text-muted-foreground">
                {new Date(h.createdAt).toLocaleString('es-AR')}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
