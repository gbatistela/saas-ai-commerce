import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { apiFetch } from '@/lib/api-server';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { SessionKeepAlive } from '@/components/session-keep-alive';

interface Empresa {
  nombre: string;
}

interface ListaConMeta {
  meta: { total: number };
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = getSession();
  if (!user) redirect('/login');

  const [empresa, conversacionesHandoff] = await Promise.all([
    apiFetch<Empresa>('/empresa').catch(() => ({ nombre: '' })),
    apiFetch<ListaConMeta>('/conversaciones?estado=HANDOFF&limit=1').catch(() => ({
      meta: { total: 0 },
    })),
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SessionKeepAlive />
      <Sidebar pendientes={conversacionesHandoff.meta.total} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar nombreEmpresa={empresa.nombre} user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
