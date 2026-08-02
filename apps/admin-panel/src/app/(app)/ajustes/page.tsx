import { apiFetch } from '@/lib/api-server';
import { AjustesTabs } from '@/components/ajustes/ajustes-tabs';
import type { EmpresaAjustes, Usuario } from '@/components/ajustes/types';

export default async function AjustesPage() {
  const [empresa, usuarios] = await Promise.all([
    apiFetch<EmpresaAjustes>('/empresa'),
    apiFetch<Usuario[]>('/usuarios'),
  ]);

  return <AjustesTabs empresa={empresa} usuarios={usuarios} />;
}
