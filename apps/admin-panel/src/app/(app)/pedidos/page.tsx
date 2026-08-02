import { apiFetch } from '@/lib/api-server';
import { PedidosTable } from '@/components/pedidos/pedidos-table';
import type { PedidoResumen } from '@/components/pedidos/types';

export default async function PedidosPage() {
  const pedidos = await apiFetch<{ data: PedidoResumen[] }>('/pedidos?limit=100');

  return <PedidosTable pedidosIniciales={pedidos.data} />;
}
