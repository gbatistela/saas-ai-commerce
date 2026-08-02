import { CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BENEFICIOS = [
  'Hasta 500 conversaciones por mes',
  'WhatsApp + Instagram + Storefront',
  'Catálogo y pedidos sin límite',
  'Dashboard de actividad de la IA',
];

/**
 * Narrativa comercial únicamente (docs/architecture/06-panel-administrador.md §9):
 * el cobro real es Fase 2. No hay backend de billing todavía.
 */
export function PlanTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Plan actual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-sm">Pro</Badge>
          <span className="text-sm text-muted-foreground">hasta 500 conversaciones/mes</span>
        </div>
        <ul className="space-y-1.5 text-sm">
          {BENEFICIOS.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {b}
            </li>
          ))}
        </ul>
        <Button variant="outline" disabled>
          Cambiar plan (próximamente)
        </Button>
      </CardContent>
    </Card>
  );
}
