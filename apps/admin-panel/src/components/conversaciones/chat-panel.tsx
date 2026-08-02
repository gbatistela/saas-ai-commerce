'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { apiClientFetch } from '@/lib/api-client';
import { QuickRepliesMenu } from './quick-replies-menu';
import type { ConversacionDetalle } from './types';

const ESTADO_LABEL: Record<ConversacionDetalle['estado'], string> = {
  ABIERTA: '🤖 IA activa',
  HANDOFF: '🟡 Esperando humano',
  CERRADA: '⚪ Cerrada',
};

export function ChatPanel({
  conversacion,
  onMensajeEnviado,
}: {
  conversacion: ConversacionDetalle | null;
  onMensajeEnviado: () => void;
}) {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [conversacion?.mensajes.data.length]);

  if (!conversacion) {
    return (
      <div className="flex h-full flex-col gap-3 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  async function enviar() {
    if (!texto.trim() || !conversacion) return;
    setEnviando(true);
    setError(null);
    try {
      await apiClientFetch(`/conversaciones/${conversacion.id}/mensajes`, {
        method: 'POST',
        body: JSON.stringify({ contenido: texto.trim() }),
      });
      setTexto('');
      onMensajeEnviado();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el mensaje');
    } finally {
      setEnviando(false);
    }
  }

  function insertarRespuestaRapida(contenido: string) {
    setTexto((t) => (t.trim() ? `${t.trim()} ${contenido}` : contenido));
    textareaRef.current?.focus();
  }

  const cerrada = conversacion.estado === 'CERRADA';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-medium">{conversacion.cliente.nombre || conversacion.cliente.telefono}</p>
        <span className="text-sm text-muted-foreground">{ESTADO_LABEL[conversacion.estado]}</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {conversacion.mensajes.data.length === 0 ? (
          <p className="pt-12 text-center text-sm text-muted-foreground">
            Todavía no hay mensajes en esta conversación.
          </p>
        ) : (
          conversacion.mensajes.data.map((m) => {
            const esCliente = m.emisor === 'CLIENTE';
            return (
              <div key={m.id} className={cn('flex', esCliente ? 'justify-start' : 'justify-end')}>
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm',
                    esCliente
                      ? 'rounded-bl-sm bg-secondary text-secondary-foreground'
                      : 'rounded-br-sm bg-primary text-primary-foreground',
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.contenido}</p>
                  <p
                    className={cn(
                      'mt-1 flex items-center gap-1 text-[10px] opacity-70',
                      esCliente ? '' : 'justify-end',
                    )}
                  >
                    {m.emisor === 'IA' && <Bot className="h-3 w-3" />}
                    {m.emisor === 'HUMANO' && <User className="h-3 w-3" />}
                    {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-3">
        {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
        {cerrada && (
          <p className="mb-2 text-xs text-muted-foreground">
            Esta conversación está cerrada. Reabrila para poder responder.
          </p>
        )}
        <div className="flex gap-2">
          <QuickRepliesMenu onSeleccionar={insertarRespuestaRapida} disabled={cerrada} />
          <textarea
            ref={textareaRef}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviar();
              }
            }}
            disabled={cerrada || enviando}
            placeholder="Escribir mensaje..."
            rows={1}
            className="flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button onClick={enviar} disabled={cerrada || enviando || !texto.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
