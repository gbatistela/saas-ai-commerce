'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmpresaTab } from './empresa-tab';
import { UsuariosTab } from './usuarios-tab';
import { PlanTab } from './plan-tab';
import type { EmpresaAjustes, Usuario } from './types';

export function AjustesTabs({
  empresa,
  usuarios,
}: {
  empresa: EmpresaAjustes;
  usuarios: Usuario[];
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Ajustes</h1>

      <Tabs defaultValue="empresa">
        <TabsList>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios y roles</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <EmpresaTab empresaInicial={empresa} />
        </TabsContent>
        <TabsContent value="usuarios">
          <UsuariosTab usuariosIniciales={usuarios} />
        </TabsContent>
        <TabsContent value="plan">
          <PlanTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
