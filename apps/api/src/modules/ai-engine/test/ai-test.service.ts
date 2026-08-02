import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EmisorMensaje } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { AI_PROVIDER, IAiProvider } from '../providers/ai-provider.interface';
import { PromptAssemblerService } from '../prompts/prompt-assembler.service';
import type { ContextoConversacion } from '../context/context-builder.service';

const CONFIG_IA_DEFAULT = {
  tono: null as string | null,
  reglasNegocioJson: null as unknown,
  modeloOpenai: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 600,
  horarioAtencionJson: null as unknown,
  condicionesHandoffJson: null as unknown,
};

export interface MensajePrueba {
  emisor: 'CLIENTE' | 'IA';
  contenido: string;
}

/**
 * "Probar el asistente" (docs/architecture/06-panel-administrador.md §8):
 * corre el mismo prompt/modelo que un mensaje real, pero con un cliente
 * sintético (sin memoria previa) y SIN function calling — así nunca crea
 * pedidos/reclamos/clientes reales ni escribe Mensaje/LogIA. Es una
 * previsualización de tono y reglas, no una conversación real.
 */
@Injectable()
export class AiTestService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER) private readonly aiProvider: IAiProvider,
    private readonly promptAssembler: PromptAssemblerService,
  ) {}

  async probar(empresaId: string, historial: MensajePrueba[]): Promise<string> {
    const [empresa, configIA, promptSistema] = await Promise.all([
      this.prisma.empresa.findUnique({ where: { id: empresaId } }),
      this.prisma.configuracionIA.findUnique({ where: { empresaId } }),
      this.prisma.prompt.findFirst({
        where: { empresaId, tipo: 'SYSTEM', activo: true },
        orderBy: { version: 'desc' },
      }),
    ]);

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const contexto: ContextoConversacion = {
      empresa,
      configIA: configIA ?? CONFIG_IA_DEFAULT,
      promptSistemaPersonalizado: promptSistema?.contenido,
      cliente: this.clienteSintetico(empresaId),
      historialReciente: historial.map((m, i) => this.mensajeSintetico(m, i)),
    };

    const mensajes = this.promptAssembler.assemble(contexto);

    const respuesta = await this.aiProvider.generarRespuesta({
      mensajes,
      funciones: [], // sin tools: no debe poder tocar carrito/pedidos/reclamos reales
      modelo: contexto.configIA.modeloOpenai,
      temperature: contexto.configIA.temperature,
      maxTokens: contexto.configIA.maxTokens,
    });

    return respuesta.contenido ?? '(el modelo no devolvió texto)';
  }

  private clienteSintetico(empresaId: string) {
    return {
      id: 'test-cliente',
      empresaId,
      nombre: null,
      telefono: null,
      email: null,
      canalOrigen: 'MANUAL' as const,
      esFrecuente: false,
      presupuestoEstimado: null,
      talleP: null,
      colorPreferido: null,
      marcaPreferida: null,
      metodoPagoPreferido: null,
      notasIA: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }

  private mensajeSintetico(m: MensajePrueba, index: number) {
    return {
      id: `test-mensaje-${index}`,
      conversacionId: 'test-conversacion',
      emisor: m.emisor as EmisorMensaje,
      tipo: 'TEXTO' as const,
      contenido: m.contenido,
      archivoId: null,
      tokensUsados: null,
      costoUsd: null,
      intencionDetectada: null,
      sentimiento: null,
      createdAt: new Date(),
    };
  }
}
