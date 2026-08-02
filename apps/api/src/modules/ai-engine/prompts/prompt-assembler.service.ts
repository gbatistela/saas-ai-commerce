import { Injectable } from '@nestjs/common';
import { AiMensaje } from '../providers/ai-provider.interface';
import { ContextoConversacion } from '../context/context-builder.service';

const PLANTILLA_HERRAMIENTAS =
  'Tenés acceso a funciones para buscar productos, consultar stock, agregar ' +
  'productos al carrito, crear pedidos, consultar el estado de un pedido y ' +
  'crear reclamos. Usalas cuando el cliente lo requiera: nunca inventes ' +
  'datos de stock, precios o números de pedido, siempre salen de esas ' +
  'funciones. Si no podés resolver algo con las herramientas disponibles, ' +
  'derivá a un humano.';

@Injectable()
export class PromptAssemblerService {
  assemble(contexto: ContextoConversacion): AiMensaje[] {
    const system: AiMensaje = {
      role: 'system',
      content: this.armarPromptSistema(contexto),
    };

    const historial: AiMensaje[] = contexto.historialReciente
      .filter((m) => m.contenido)
      .map((m) => ({
        role: m.emisor === 'CLIENTE' ? 'user' : 'assistant',
        content: m.contenido,
      }));

    return [system, ...historial];
  }

  private armarPromptSistema(contexto: ContextoConversacion): string {
    const { empresa, configIA, cliente, promptSistemaPersonalizado } = contexto;
    const tono = configIA.tono || 'cercano y profesional';

    const bloques = [
      `Sos un asesor comercial humano, no un bot. Nunca digas que sos una ` +
        `inteligencia artificial. Nunca inventes información que no tengas: ` +
        `si no sabés algo, preguntalo o derivá a un humano. Mantené un tono ` +
        `${tono}. Tu objetivo es vender, resolver dudas y generar confianza, ` +
        `no solo responder preguntas.`,

      `Trabajás para ${empresa.nombre}${empresa.rubro ? `, un negocio de ${empresa.rubro}` : ''}.` +
        this.textoDeJson(configIA.horarioAtencionJson, (t) => `\nHorario de atención: ${t}.`) +
        this.textoDeJson(
          configIA.reglasNegocioJson,
          (t) => `\nReglas específicas de este negocio: ${t}.`,
        ),

      PLANTILLA_HERRAMIENTAS,

      this.condicionesHandoff(configIA.condicionesHandoffJson),

      this.bloqueMemoriaCliente(cliente),
    ];

    if (promptSistemaPersonalizado) {
      bloques.push(
        `Instrucciones adicionales específicas de esta empresa:\n${promptSistemaPersonalizado}`,
      );
    }

    return bloques.filter(Boolean).join('\n\n');
  }

  /** {texto: string} se muestra en prosa; cualquier otra forma cae a JSON crudo (compat). */
  private textoDeJson(valor: unknown, formatear: (texto: string) => string): string {
    if (!valor || typeof valor !== 'object') return '';
    const texto = (valor as Record<string, unknown>).texto;
    if (typeof texto === 'string' && texto.trim()) return formatear(texto.trim());
    return formatear(JSON.stringify(valor));
  }

  private condicionesHandoff(valor: unknown): string {
    if (valor && typeof valor === 'object' && 'pedirHumano' in valor) {
      const v = valor as {
        pedirHumano?: boolean;
        quejaGrave?: boolean;
        montoMayorA?: number | null;
      };
      const condiciones: string[] = [];
      if (v.pedirHumano !== false) condiciones.push('el cliente pide hablar con una persona');
      if (v.quejaGrave !== false) condiciones.push('hay un reclamo o queja con tono muy negativo');
      if (v.montoMayorA) condiciones.push(`la compra supera los $${v.montoMayorA}`);

      if (condiciones.length === 0) {
        return 'No derives a un humano salvo que realmente no puedas resolver la consulta.';
      }
      return `Derivá a un humano (función derivar_a_humano) si: ${condiciones.join('; ')}.`;
    }

    return (
      `Derivá a un humano (función derivar_a_humano) si el cliente pide ` +
      `hablar con una persona, hay una queja grave, o se detecta ` +
      `intención de cancelar una compra grande.`
    );
  }

  private bloqueMemoriaCliente(cliente: ContextoConversacion['cliente']): string | null {
    const datos: string[] = [];

    if (cliente.nombre) datos.push(`nombre: ${cliente.nombre}`);
    if (cliente.talleP) datos.push(`talle preferido: ${cliente.talleP}`);
    if (cliente.colorPreferido) datos.push(`color preferido: ${cliente.colorPreferido}`);
    if (cliente.marcaPreferida) datos.push(`marca preferida: ${cliente.marcaPreferida}`);
    if (cliente.presupuestoEstimado)
      datos.push(`presupuesto estimado: ${cliente.presupuestoEstimado}`);
    if (cliente.metodoPagoPreferido)
      datos.push(`método de pago preferido: ${cliente.metodoPagoPreferido}`);
    if (cliente.esFrecuente) datos.push('es cliente frecuente');
    if (cliente.notasIA) datos.push(`notas previas: ${cliente.notasIA}`);

    if (datos.length === 0) return null;

    return `Lo que sabés de este cliente de charlas anteriores: ${datos.join('; ')}.`;
  }
}
