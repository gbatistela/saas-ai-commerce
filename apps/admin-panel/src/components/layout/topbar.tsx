'use client';

import { useRouter } from 'next/navigation';
import { Bell, LogOut, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SessionUser } from '@/lib/session';

function iniciales(nombre: string, email: string) {
  const base = nombre?.trim() || email;
  return base
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function Topbar({
  nombreEmpresa,
  user,
}: {
  nombreEmpresa: string;
  user: SessionUser;
}) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Search className="h-4 w-4" />
        <span>Buscar...</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{iniciales(user.email, user.email)}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight">{user.email}</p>
              <p className="text-xs leading-tight text-muted-foreground">{nombreEmpresa}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.rol}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
