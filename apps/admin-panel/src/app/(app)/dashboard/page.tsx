import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiFetch } from '@/lib/api-server';
import { getSession } from '@/lib/session';
import { formatMoneda, formatNumero, formatPorcentaje } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { SalesChart, type PuntoVenta } from '@/components/dashboard/sales-chart';
import { MessageSquare } from 'lucide-react';

interface Resumen {
  ventasTotal: number;
  pedidosCount: number;
  conversacionesCount: number;
  tasaConversion: number;
}

interface ProductoTop {
  productoId: string;
  nombre: string;
  cantidadVendida: number;
  totalVendido: number;
}

interface MetricasIA {
  tokensPrompt: number;
  tokensCompletion: number;
  costoUsdEstimado: number;
  latenciaPromedioMs: number;
  mensajesPorEmisor: Record<string, number>;
}

interface Conversacion {
  id: string;
  estado: 'ABIERTA' | 'CERRADA' | 'HANDOFF';
  ultimoMensajeAt: string | null;
  cliente: { nombre: string | null; telefono: string | null };
}

const ESTADO_INFO: Record<Conversacion['estado'], { color: string; label: string }> = {
  ABIERTA: { color: 'bg-success', label: 'IA activa' },
  HANDOFF: { color: 'bg-warning', label: 'Esperando humano' },
  CERRADA: { color: 'bg-muted-foreground', label: 'Cerrada' },
};

function calcularTendencia(actual: number, anterior: number) {
  if (anterior === 0) return null;
  const variacion = (actual - anterior) / anterior;
  return {
    positiva: variacion >= 0,
    texto: `${variacion >= 0 ? '▲' : '▼'} ${Math.abs(variacion * 100).toFixed(0)}% vs período anterior`,
  };
}

export default async function DashboardPage() {
  const user = getSession()!;
  const nombreSaludo = user.email.split('@')[0];

  const ahora = new Date();
  const hace30 = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
  const hace60 = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [resumenActual, resumenAnterior, ventas, topProductos, metricasIA, conversaciones] =
    await Promise.all([
      apiFetch<Resumen>('/dashboard/resumen'),
      apiFetch<Resumen>(
        `/dashboard/resumen?desde=${hace60.toISOString()}&hasta=${hace30.toISOString()}`,
      ),
      apiFetch<PuntoVenta[]>('/dashboard/ventas'),
      apiFetch<ProductoTop[]>('/dashboard/productos-mas-vendidos?limit=5'),
      apiFetch<MetricasIA>('/dashboard/ia'),
      apiFetch<{ data: Conversacion[] }>('/conversaciones?limit=5'),
    ]);

  const tendenciaVentas = calcularTendencia(resumenActual.ventasTotal, resumenAnterior.ventasTotal);
  const tendenciaPedidos = calcularTendencia(resumenActual.pedidosCount, resumenAnterior.pedidosCount);
  const tendenciaConversaciones = calcularTendencia(
    resumenActual.conversacionesCount,
    resumenAnterior.conversacionesCount,
  );
  const tendenciaConversion = calcularTendencia(
    resumenActual.tasaConversion,
    resumenAnterior.tasaConversion,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hola {nombreSaludo} 👋
        </h1>
        <p className="text-muted-foreground">Así viene funcionando tu asistente (últimos 30 días)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          titulo="Ventas del período"
          valor={formatMoneda(resumenActual.ventasTotal)}
          tendencia={tendenciaVentas ?? undefined}
        />
        <KpiCard
          titulo="Pedidos"
          valor={formatNumero(resumenActual.pedidosCount)}
          tendencia={tendenciaPedidos ?? undefined}
        />
        <KpiCard
          titulo="Conversaciones"
          valor={formatNumero(resumenActual.conversacionesCount)}
          detalle={`${formatNumero(metricasIA.mensajesPorEmisor.IA ?? 0)} mensajes por IA`}
          tendencia={tendenciaConversaciones ?? undefined}
        />
        <KpiCard
          titulo="Conversión"
          valor={formatPorcentaje(resumenActual.tasaConversion)}
          tendencia={tendenciaConversion ?? undefined}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            📈 Ventas (últimos 30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ventas.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Todavía no hay ventas registradas en este período.
            </p>
          ) : (
            <SalesChart datos={ventas} />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              🏆 Productos más vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProductos.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Todavía no hay productos vendidos.
              </p>
            ) : (
              <ol className="space-y-3">
                {topProductos.map((p, i) => (
                  <li key={p.productoId} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {i + 1}
                      </span>
                      {p.nombre}
                    </span>
                    <span className="text-muted-foreground">
                      {formatNumero(p.cantidadVendida)} ventas
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              🤖 Actividad de la IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tokens usados</span>
              <span className="font-medium">
                {formatNumero(metricasIA.tokensPrompt + metricasIA.tokensCompletion)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Costo estimado</span>
              <span className="font-medium">${metricasIA.costoUsdEstimado.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tiempo resp. promedio</span>
              <span className="font-medium">
                {(metricasIA.latenciaPromedioMs / 1000).toFixed(1)}s
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            💬 Últimas conversaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conversaciones.data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Todavía no llegó ninguna conversación. Conectá WhatsApp o Instagram para empezar.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {conversaciones.data.map((c) => {
                const info = ESTADO_INFO[c.estado];
                return (
                  <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${info.color}`} />
                      <span className="font-medium">{c.cliente.nombre || c.cliente.telefono}</span>
                      <Badge variant="outline">{info.label}</Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {c.ultimoMensajeAt
                        ? formatDistanceToNow(new Date(c.ultimoMensajeAt), {
                            addSuffix: true,
                            locale: es,
                          })
                        : ''}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
