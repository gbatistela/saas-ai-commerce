'use client';

import { useState } from 'react';
import { Plus, Trash2, UserCog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClientFetch } from '@/lib/api-client';
import type { EstadoUsuario, RolUsuario, Usuario } from './types';

export function UsuariosTab({ usuariosIniciales }: { usuariosIniciales: Usuario[] }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'ADMIN' | 'AGENTE'>('AGENTE');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function recargar() {
    const res = await apiClientFetch<Usuario[]>('/usuarios');
    setUsuarios(res);
  }

  async function invitar() {
    if (!nombre.trim() || !email.trim() || password.length < 8) {
      setError('Completá nombre, email y una contraseña de al menos 8 caracteres');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await apiClientFetch('/usuarios', {
        method: 'POST',
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim(), password, rol }),
      });
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('AGENTE');
      setDialogAbierto(false);
      await recargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo invitar al usuario');
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarRol(id: string, nuevoRol: RolUsuario) {
    if (nuevoRol === 'OWNER') return;
    await apiClientFetch(`/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ rol: nuevoRol }),
    });
    recargar();
  }

  async function desactivar(id: string) {
    await apiClientFetch(`/usuarios/${id}`, { method: 'DELETE' });
    recargar();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialogAbierto(true)}>
          <Plus className="h-4 w-4" /> Invitar usuario
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-medium uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Nombre</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Rol</th>
                <th className="px-4 py-2.5">Estado</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2.5 font-medium">{u.nombre}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-2.5">
                    {u.rol === 'OWNER' ? (
                      <Badge>OWNER</Badge>
                    ) : (
                      <Select value={u.rol} onValueChange={(v) => cambiarRol(u.id, v as RolUsuario)}>
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="AGENTE">AGENTE</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={u.estado === 'ACTIVO' ? 'success' : 'secondary'}>
                      {u.estado}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {u.rol !== 'OWNER' && u.estado === 'ACTIVO' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => desactivar(u.id)}
                        title="Desactivar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-4 w-4" /> Invitar usuario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Contraseña temporal</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Rol</Label>
              <Select value={rol} onValueChange={(v) => setRol(v as 'ADMIN' | 'AGENTE')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGENTE">AGENTE — conversaciones, pedidos, reclamos</SelectItem>
                  <SelectItem value="ADMIN">ADMIN — todo salvo facturación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={invitar} disabled={guardando}>
              {guardando ? 'Invitando...' : 'Invitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
