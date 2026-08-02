import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function KpiCard({
  titulo,
  valor,
  detalle,
  tendencia,
}: {
  titulo: string;
  valor: string;
  detalle?: string;
  tendencia?: { positiva: boolean; texto: string };
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight">{valor}</p>
        {tendencia ? (
          <p
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              tendencia.positiva ? 'text-success' : 'text-destructive',
            )}
          >
            {tendencia.positiva ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {tendencia.texto}
          </p>
        ) : detalle ? (
          <p className="text-xs text-muted-foreground">{detalle}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
