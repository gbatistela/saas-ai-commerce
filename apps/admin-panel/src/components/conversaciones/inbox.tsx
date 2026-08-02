'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { apiClientFetch } from '@/lib/api-client';
import { ConversationListItem } from './conversation-list-item';
import { ChatPanel } from './chat-panel';
import { ClientPanel } from './client-panel';
import type { ClienteDetalle, ConversacionDetalle, ConversacionResumen } from './types';

const POLL_MS = 6000;

export function Inbox({ conversacionesIniciales }: { conversacionesIniciales: ConversacionResumen[] }) {
  const [conversaciones, setConversaciones] = useState(conversacionesIniciales);
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(
    conversacionesIniciales[0]?.id ?? null,
  );
  const [detalle, setDetalle] = useState<ConversacionDetalle | null>(null);
  const [cliente, setCliente] = useState<ClienteDetalle | null>(null);

  const cargarLista = useCallback(async () => {
    const res = await apiClientFetch<{ data: ConversacionResumen[] }>('/conversaciones?limit=50');
    setConversaciones(res.data);
  }, []);

  const cargarDetalle = useCallback(async (id: string) => {
    const conv = await apiClientFetch<ConversacionDetalle>(`/conversaciones/${id}?limit=100`);
    setDetalle(conv);
    apiClientFetch<ClienteDetalle>(`/clientes/${conv.clienteId}`)
      .then(setCliente)
      .catch(() => setCliente(null));
  }, []);

  useEffect(() => {
    if (!seleccionadaId) {
      setDetalle(null);
      setCliente(null);
      return;
    }
    setDetalle(null);
    setCliente(null);
    cargarDetalle(seleccionadaId);
  }, [seleccionadaId, cargarDetalle]);

  // Poll liviano: la lista y la conversación activa se refrescan solas
  // para simular "en vivo" sin necesitar websockets todavía.
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      cargarLista();
      if (seleccionadaId) cargarDetalle(seleccionadaId);
    }, POLL_MS);
    return () => clearInterval(intervalRef.current);
  }, [seleccionadaId, cargarLista, cargarDetalle]);

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-[280px_1fr_280px] overflow-hidden rounded-xl border border-border">
      <div className="overflow-y-auto border-r border-border">
        {conversaciones.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Sin conversaciones todavía.</p>
          </div>
        ) : (
          conversaciones.map((c) => (
            <ConversationListItem
              key={c.id}
              conversacion={c}
              activa={c.id === seleccionadaId}
              onClick={() => setSeleccionadaId(c.id)}
            />
          ))
        )}
      </div>

      <div className="overflow-hidden">
        <ChatPanel conversacion={detalle} onMensajeEnviado={() => seleccionadaId && cargarDetalle(seleccionadaId)} />
      </div>

      <div className="overflow-y-auto border-l border-border">
        <ClientPanel cliente={cliente} />
      </div>
    </div>
  );
}
