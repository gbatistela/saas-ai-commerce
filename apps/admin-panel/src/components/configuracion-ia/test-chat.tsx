'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { apiClientFetch, ApiClientError } from '@/lib/api-client';

interface Turno {
  emisor: 'CLIENTE' | 'IA';
  contenido: string;
}

export function TestChat() {
  const [historial, setHistorial] = useState<Turno[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [historial.length]);

  async function enviar() {
    const mensaje = texto.trim();
    if (!mensaje || enviando) return;

    setTexto('');
    setError(null);
    const historialPrevio = historial;
    setHistorial((h) => [...h, { emisor: 'CLIENTE', contenido: mensaje }]);
    setEnviando(true);

    try {
      const res = await apiClientFetch<{ respuesta: string }>('/ai/probar', {
        method: 'POST',
        body: JSON.stringify({ mensaje, historial: historialPrevio }),
      });
      setHistorial((h) => [...h, { emisor: 'IA', contenido: res.respuesta }]);
    } catch (e) {
      const msg =
        e instanceof ApiClientError
          ? e.message
          : 'No se pudo conectar con el asistente';
      setError(msg);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex h-[420px] flex-col rounded-xl border border-border">
      <div className="border-b border-border px-4 py-2.5">
        <p className="text-sm font-medium">💬 Chat de prueba</p>
        <p className="text-xs text-muted-foreground">
          Usa el AI Engine real con la config guardada. No crea clientes ni pedidos.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {historial.length === 0 ? (
          <p className="pt-8 text-center text-sm text-muted-foreground">
            Escribí como si fueras un cliente para ver cómo responde el asistente.
          </p>
        ) : (
          historial.map((t, i) => (
            <div key={i} className={cn('flex', t.emisor === 'CLIENTE' ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'flex max-w-[80%] items-start gap-1.5 rounded-2xl px-3.5 py-2 text-sm',
                  t.emisor === 'CLIENTE'
                    ? 'rounded-bl-sm bg-secondary text-secondary-foreground'
                    : 'rounded-br-sm bg-primary text-primary-foreground',
                )}
              >
                {t.emisor === 'IA' && <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                <p className="whitespace-pre-wrap">{t.contenido}</p>
                {t.emisor === 'CLIENTE' && <User className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
              </div>
            </div>
          ))
        )}
        {enviando && <p className="text-xs text-muted-foreground">El asistente está escribiendo...</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder="Escribí un mensaje de prueba..."
          className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button size="icon" onClick={enviar} disabled={enviando || !texto.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
