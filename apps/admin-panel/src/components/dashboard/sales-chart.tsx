'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMoneda } from '@/lib/format';

export interface PuntoVenta {
  fecha: string;
  total: number;
  cantidadPedidos: number;
}

export function SalesChart({ datos }: { datos: PuntoVenta[] }) {
  const data = datos.map((d) => ({
    ...d,
    fechaCorta: new Date(d.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="fechaCorta"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={70}
          tickFormatter={(v) => formatMoneda(v).replace(/,00$/, '')}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 8,
            fontSize: 13,
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number) => [formatMoneda(value), 'Ventas']}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#colorVentas)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
