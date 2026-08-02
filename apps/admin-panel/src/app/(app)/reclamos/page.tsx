import { apiFetch } from '@/lib/api-server';
import { KanbanBoard } from '@/components/reclamos/kanban-board';
import type { ReclamoResumen } from '@/components/reclamos/types';

export default async function ReclamosPage() {
  const reclamos = await apiFetch<{ data: ReclamoResumen[] }>('/reclamos?limit=100');

  return <KanbanBoard reclamosIniciales={reclamos.data} />;
}
