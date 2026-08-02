'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClientFetch } from '@/lib/api-client';
import { VariantesTab } from './variantes-tab';
import { RelacionadosTab } from './relacionados-tab';
import type { Categoria, Marca, ProductoDetalle } from './types';

const FORM_VACIO = {
  nombre: '',
  sku: '',
  descripcion: '',
  precio: '',
  costo: '',
  categoriaId: '',
  marcaId: '',
  destacado: false,
};

function aplanarCategorias(categorias: Categoria[], nivel = 0): { id: string; label: string }[] {
  return categorias.flatMap((c) => [
    { id: c.id, label: `${'— '.repeat(nivel)}${c.nombre}` },
    ...(c.subcategorias ? aplanarCategorias(c.subcategorias, nivel + 1) : []),
  ]);
}

export function ProductFormDialog({
  open,
  onOpenChange,
  productoId,
  categorias,
  marcas,
  onGuardado,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productoId: string | null;
  categorias: Categoria[];
  marcas: Marca[];
  onGuardado: () => void;
}) {
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState(FORM_VACIO);
  const [detalle, setDetalle] = useState<ProductoDetalle | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idActual = productoId ?? creatingId;
  const categoriasPlanas = aplanarCategorias(categorias);

  async function cargarDetalle(id: string) {
    const d = await apiClientFetch<ProductoDetalle>(`/productos/${id}`);
    setDetalle(d);
    setForm({
      nombre: d.nombre,
      sku: d.sku,
      descripcion: d.descripcion ?? '',
      precio: String(d.precio),
      costo: d.costo ? String(d.costo) : '',
      categoriaId: d.categoriaId ?? '',
      marcaId: d.marcaId ?? '',
      destacado: d.destacado,
    });
  }

  useEffect(() => {
    if (!open) return;
    setTab('info');
    setError(null);
    if (productoId) {
      cargarDetalle(productoId);
    } else {
      setForm(FORM_VACIO);
      setDetalle(null);
      setCreatingId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, productoId]);

  async function guardarInfo() {
    if (!form.nombre.trim() || !form.sku.trim() || !form.precio) {
      setError('Nombre, SKU y precio son obligatorios');
      return;
    }

    setGuardando(true);
    setError(null);

    const payload = {
      nombre: form.nombre.trim(),
      sku: form.sku.trim(),
      descripcion: form.descripcion.trim() || undefined,
      precio: Number(form.precio),
      costo: form.costo ? Number(form.costo) : undefined,
      categoriaId: form.categoriaId || undefined,
      marcaId: form.marcaId || undefined,
      destacado: form.destacado,
    };

    try {
      if (idActual) {
        await apiClientFetch(`/productos/${idActual}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        const creado = await apiClientFetch<{ id: string }>('/productos', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setCreatingId(creado.id);
        await cargarDetalle(creado.id);
      }
      onGuardado();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{idActual ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="info">Info general</TabsTrigger>
            <TabsTrigger value="variantes" disabled={!idActual}>
              Variantes
            </TabsTrigger>
            <TabsTrigger value="relacionados" disabled={!idActual}>
              Relacionados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label>Nombre *</Label>
                <Input
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Campera de cuero negra"
                />
              </div>
              <div className="space-y-1">
                <Label>SKU *</Label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Precio *</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.precio}
                  onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Costo</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.costo}
                  onChange={(e) => setForm((f) => ({ ...f, costo: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Categoría</Label>
                <Select
                  value={form.categoriaId || undefined}
                  onValueChange={(v) => setForm((f) => ({ ...f, categoriaId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasPlanas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Marca</Label>
                <Select
                  value={form.marcaId || undefined}
                  onValueChange={(v) => setForm((f) => ({ ...f, marcaId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Descripción</Label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Switch
                  checked={form.destacado}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, destacado: v }))}
                />
                <Label>Producto destacado</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variantes">
            {idActual && detalle && (
              <VariantesTab
                productoId={idActual}
                variantes={detalle.variantes}
                onCambio={() => cargarDetalle(idActual)}
              />
            )}
          </TabsContent>

          <TabsContent value="relacionados">
            {idActual && detalle && (
              <RelacionadosTab
                productoId={idActual}
                relacionados={detalle.relacionadosDesde}
                onCambio={() => cargarDetalle(idActual)}
              />
            )}
          </TabsContent>
        </Tabs>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {tab === 'info' && (
            <Button onClick={guardarInfo} disabled={guardando}>
              {guardando ? 'Guardando...' : idActual ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
