import { apiFetch } from '@/lib/api-server';
import { Inbox } from '@/components/conversaciones/inbox';
import type { ConversacionResumen } from '@/components/conversaciones/types';

export default async function ConversacionesPage() {
  const { data } = await apiFetch<{ data: ConversacionResumen[] }>('/conversaciones?limit=50');

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Conversaciones</h1>
      <Inbox conversacionesIniciales={data} />
    </div>
  );
}
