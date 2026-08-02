import { Construction } from 'lucide-react';

export function EnConstruccion({ titulo }: { titulo: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
      <Construction className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="font-medium">{titulo}</p>
        <p className="text-sm text-muted-foreground">Esta sección todavía se está construyendo.</p>
      </div>
    </div>
  );
}
