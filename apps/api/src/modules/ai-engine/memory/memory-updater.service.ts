import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { AI_PROVIDER, IAiProvider } from '../providers/ai-provider.interface';

const CAMPOS_VALIDOS = [
  'talleP',
  'colorPreferido',
  'marcaPreferida',
  'presupuestoEstimado',
  'metodoPagoPreferido',
  'notasIA',
] as const;

const PROMPT_EXTRACCION = `Analizá este intercambio entre un cliente y un asesor de ventas.
Si el cliente mencionó explícitamente alguna preferencia NUEVA, devolvé un JSON
con SOLO los campos detectados (no inventes ni completes campos no mencionados):
{"talleP": string, "colorPreferido": string, "marcaPreferida": string, "presupuestoEstimado": number, "metodoPagoPreferido": string, "notasIA": string}
"notasIA" es para una nota corta y útil que no encaje en los otros campos.
Si no detectaste nada nuevo, devolvé {}.
Respondé ÚNICAMENTE con el JSON, sin texto adicional ni bloques de código.`;

/**
 * Analiza el intercambio recién ocurrido y actualiza los campos
 * estructurados de memoria del Cliente (docs/architecture/05-ai-engine.md §5).
 * Se invoca "fire and forget" desde el orchestrator: nunca debe bloquear ni
 * hacer fallar la respuesta al cliente.
 */
@Injectable()
export class MemoryUpdaterService {
  private readonly logger = new Logger(MemoryUpdaterService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER) private readonly aiProvider: IAiProvider,
  ) {}

  actualizar(clienteId: string, mensajeCliente: string, respuestaIA: string): void {
    this.ejecutar(clienteId, mensajeCliente, respuestaIA).catch((error) => {
      this.logger.warn(
        `No se pudo actualizar la memoria del cliente ${clienteId}: ${error?.message ?? error}`,
      );
    });
  }

  private async ejecutar(clienteId: string, mensajeCliente: string, respuestaIA: string) {
    const respuesta = await this.aiProvider.generarRespuesta({
      mensajes: [
        {
          role: 'system',
          content: `${PROMPT_EXTRACCION}\n\nCliente: "${mensajeCliente}"\nAsesor: "${respuestaIA}"`,
        },
      ],
      funciones: [],
      modelo: 'gpt-4o-mini',
      temperature: 0,
      maxTokens: 200,
    });

    const detectado = this.parsearJson(respuesta.contenido);
    if (!detectado) return;

    const data: Record<string, unknown> = {};
    for (const campo of CAMPOS_VALIDOS) {
      const valor = detectado[campo];
      if (valor !== undefined && valor !== null && valor !== '') {
        data[campo] = valor;
      }
    }

    if (Object.keys(data).length === 0) return;

    await this.prisma.cliente.update({ where: { id: clienteId }, data });
  }

  private parsearJson(contenido: string | null): Record<string, any> | null {
    if (!contenido) return null;
    try {
      const limpio = contenido.replace(/```json|```/g, '').trim();
      const parseado = JSON.parse(limpio);
      return typeof parseado === 'object' && parseado !== null ? parseado : null;
    } catch {
      return null;
    }
  }
}
