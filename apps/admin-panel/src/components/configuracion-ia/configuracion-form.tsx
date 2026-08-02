'use client';

import { useState } from 'react';
import { MessageCircle, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClientFetch } from '@/lib/api-client';
import { TestChat } from './test-chat';
import type { ConfiguracionIA, Empresa } from './types';

export function ConfiguracionForm({
  empresaInicial,
  configuracionInicial,
}: {
  empresaInicial: Empresa;
  configuracionInicial: ConfiguracionIA;
}) {
  const [nombre, setNombre] = useState(empresaInicial.nombre);
  const [rubro, setRubro] = useState(empresaInicial.rubro ?? '');
  const [tono, setTono] = useState(configuracionInicial.tono ?? '');
  const [horario, setHorario] = useState(configuracionInicial.horarioAtencionJson?.texto ?? '');
  const [reglas, setReglas] = useState(configuracionInicial.reglasNegocioJson?.texto ?? '');
  const [pedirHumano, setPedirHumano] = useState(
    configuracionInicial.condicionesHandoffJson?.pedirHumano ?? true,
  );
  const [quejaGrave, setQuejaGrave] = useState(
    configuracionInicial.condicionesHandoffJson?.quejaGrave ?? true,
  );
  const [montoMayorA, setMontoMayorA] = useState(
    configuracionInicial.condicionesHandoffJson?.montoMayorA?.toString() ?? '',
  );

  const [mostrarChat, setMostrarChat] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function guardar() {
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      await Promise.all([
        apiClientFetch('/empresa', {
          method: 'PATCH',
          body: JSON.stringify({ nombre, rubro: rubro || undefined }),
        }),
        apiClientFetch('/empresa/configuracion-ia', {
          method: 'PUT',
          body: JSON.stringify({
            tono: tono || undefined,
            horarioAtencionJson: horario ? { texto: horario } : undefined,
            reglasNegocioJson: reglas ? { texto: reglas } : undefined,
            condicionesHandoffJson: {
              pedirHumano,
              quejaGrave,
              montoMayorA: montoMayorA ? Number(montoMayorA) : null,
            },
          }),
        }),
      ]);
      setMensaje('Cambios guardados.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Configuración del Asistente</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Datos generales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Nombre del negocio</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <p className="text-xs text-muted-foreground">Para que la IA se presente.</p>
            </div>
            <div className="space-y-1">
              <Label>Rubro del negocio</Label>
              <Input
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                placeholder="Perfumería, indumentaria, veterinaria..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Tono de comunicación</Label>
            <Input
              value={tono}
              onChange={(e) => setTono(e.target.value)}
              placeholder="Cercano y cálido"
            />
          </div>

          <div className="space-y-1">
            <Label>Horario de atención IA</Label>
            <Input
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              placeholder="Lun a Vie 9 a 20hs"
            />
          </div>

          <div className="space-y-1">
            <Label>Reglas específicas del negocio</Label>
            <textarea
              value={reglas}
              onChange={(e) => setReglas(e.target.value)}
              rows={3}
              placeholder="Ofrecé siempre muestras gratis en compras mayores a $30.000. No hacemos envíos los domingos."
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Texto libre, se inyecta al prompt del asistente.</p>
          </div>

          <div className="space-y-2">
            <Label>Cuándo derivar a un humano</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={pedirHumano} onCheckedChange={(v) => setPedirHumano(Boolean(v))} />
                Cliente pide hablar con una persona
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={quejaGrave} onCheckedChange={(v) => setQuejaGrave(Boolean(v))} />
                Reclamo con tono muy negativo
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">Compra mayor a $</span>
                <Input
                  type="number"
                  min={0}
                  value={montoMayorA}
                  onChange={(e) => setMontoMayorA(e.target.value)}
                  className="h-8 w-32"
                />
              </label>
            </div>
          </div>

          {mensaje && <p className="text-sm text-success">{mensaje}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMostrarChat((v) => !v)}>
              <MessageCircle className="h-4 w-4" /> Probar el asistente
            </Button>
            <Button onClick={guardar} disabled={guardando}>
              <Save className="h-4 w-4" /> {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {mostrarChat && <TestChat />}
    </div>
  );
}
