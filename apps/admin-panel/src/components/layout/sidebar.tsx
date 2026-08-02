'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  Bot,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/conversaciones', label: 'Conversaciones', icon: MessageSquare },
  { href: '/pedidos', label: 'Pedidos', icon: Package },
  { href: '/productos', label: 'Productos', icon: ShoppingBag },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/reclamos', label: 'Reclamos', icon: Ticket },
  { href: '/configuracion-ia', label: 'Configuración IA', icon: Bot },
  { href: '/ajustes', label: 'Ajustes', icon: Settings },
];

export function Sidebar({ pendientes = 0 }: { pendientes?: number }) {
  const pathname = usePathname();
  const [colapsado, setColapsado] = useState(false);

  return (
    <aside
      className={cn(
        'flex h-screen shrink-0 flex-col border-r border-border bg-card transition-all duration-200',
        colapsado ? 'w-[68px]' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          AI
        </div>
        {!colapsado && <span className="truncate text-sm font-semibold">Panel</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const activo = pathname.startsWith(item.href);
          const Icon = item.icon;
          const mostrarBadge = item.href === '/conversaciones' && pendientes > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                activo
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              title={colapsado ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!colapsado && <span className="flex-1 truncate">{item.label}</span>}
              {!colapsado && mostrarBadge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-warning-foreground">
                  {pendientes}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setColapsado((v) => !v)}
        className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground hover:bg-accent"
      >
        {colapsado ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!colapsado && 'Colapsar'}
      </button>
    </aside>
  );
}
