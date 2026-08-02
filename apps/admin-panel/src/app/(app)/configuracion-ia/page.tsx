import { apiFetch } from '@/lib/api-server';
import { ConfiguracionForm } from '@/components/configuracion-ia/configuracion-form';
import type { ConfiguracionIA, Empresa } from '@/components/configuracion-ia/types';

export default async function ConfiguracionIaPage() {
  const [empresa, configuracion] = await Promise.all([
    apiFetch<Empresa>('/empresa'),
    apiFetch<ConfiguracionIA>('/empresa/configuracion-ia'),
  ]);

  return <ConfiguracionForm empresaInicial={empresa} configuracionInicial={configuracion} />;
}
