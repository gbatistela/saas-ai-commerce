import { apiFetch } from '@/lib/api-server';
import { ClientList } from '@/components/clientes/client-list';
import type { ClienteResumen } from '@/components/clientes/types';

export default async function ClientesPage() {
  const clientes = await apiFetch<{ data: ClienteResumen[] }>('/clientes?limit=100');

  return <ClientList clientesIniciales={clientes.data} />;
}
