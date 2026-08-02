import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { SEND_MESSAGE_QUEUE } from '../../../infra/queue/queue.constants';
import { AI_PROVIDER, AiMensaje, IAiProvider } from '../providers/ai-provider.interface';
import { estimarCostoUsd } from '../providers/openai-pricing';
import { ContextBuilderService } from '../context/context-builder.service';
import { PromptAssemblerService } from '../prompts/prompt-assembler.service';
import { FUNCIONES_DISPONIBLES } from '../functions/definitions/funciones';
import { FunctionExecutorService } from '../functions/function-executor.service';
import { MemoryUpdaterService } from '../memory/memory-updater.service';

const MAX_ITERACIONES_FUNCTION_CALLING = 3;

export interface ProcessMessageJobData {
  empresaId: string;
  conversacionId: string;
  mensajeId: string;
  clienteId: string;
  canal: string;
}

@Injectable()
export class ConversationOrchestratorService {
  private readonly logger = new Logger(ConversationOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_PROVIDER) private readonly aiProvider: IAiProvider,
    private readonly contextBuilder: ContextBuilderService,
    private readonly promptAssembler: PromptAssemblerService,
    private readonly functionExecutor: FunctionExecutorService,
    private readonly memoryUpdater: MemoryUpdaterService,
    @InjectQueue(SEND_MESSAGE_QUEUE) private readonly sendMessageQueue: Queue,
  ) {}

  async handle(job: ProcessMessageJobData) {
    const conversacion = await this.prisma.conversacion.findUnique({
      where: { id: job.conversacionId },
    });

    if (!conversacion || conversacion.empresaId !== job.empresaId) {
      this.logger.warn(`Conversación ${job.conversacionId} no encontrada, se descarta el job`);
      return;
    }

    // Si un humano ya tomó control (HANDOFF) o la conversación está
    // CERRADA, la IA no responde automáticamente (docs/05-ai-engine.md §2a).
    if (conversacion.estado !== 'ABIERTA') {
      this.logger.log(
        `Conversación ${job.conversacionId} en estado ${conversacion.estado}, la IA no responde`,
      );
      return;
    }

    const mensajeCliente = await this.prisma.mensaje.findUnique({
      where: { id: job.mensajeId },
    });

    const contexto = await this.contextBuilder.build(
      job.empresaId,
      job.conversacionId,
      job.clienteId,
    );

    const mensajes = this.promptAssembler.assemble(contexto);
    const promptEnviado = mensajes.map((m) => `[${m.role}] ${m.content ?? ''}`).join('\n');

    const modelo = contexto.configIA.modeloOpenai;
    const temperature = contexto.configIA.temperature;
    const maxTokens = contexto.configIA.maxTokens;

    const inicio = Date.now();
    let tokensPrompt = 0;
    let tokensCompletion = 0;
    const funcionesLlamadas: string[] = [];
    let contenidoFinal: string | null = null;
    let seDerivoAHumano = false;

    for (let iteracion = 0; iteracion < MAX_ITERACIONES_FUNCTION_CALLING; iteracion++) {
      const respuesta = await this.aiProvider.generarRespuesta({
        mensajes,
        // Si ya se derivó a un humano, no ofrecemos más funciones: se
        // fuerza una respuesta de texto que cierre la interacción.
        funciones: seDerivoAHumano ? [] : FUNCIONES_DISPONIBLES,
        modelo,
        temperature,
        maxTokens,
      });

      tokensPrompt += respuesta.tokensPrompt;
      tokensCompletion += respuesta.tokensCompletion;

      if (respuesta.toolCalls.length === 0) {
        contenidoFinal = respuesta.contenido;
        break;
      }

      mensajes.push({
        role: 'assistant',
        content: respuesta.contenido,
        toolCalls: respuesta.toolCalls,
      });

      for (const toolCall of respuesta.toolCalls) {
        const argumentos = this.parsearArgumentos(toolCall.arguments);
        funcionesLlamadas.push(toolCall.name);

        const resultado = await this.functionExecutor.ejecutar(toolCall.name, argumentos, {
          empresaId: job.empresaId,
          clienteId: job.clienteId,
          conversacionId: job.conversacionId,
        });

        if (toolCall.name === 'derivar_a_humano') {
          seDerivoAHumano = true;
        }

        mensajes.push({
          role: 'tool',
          toolCallId: toolCall.id,
          content: JSON.stringify(resultado),
        });
      }
    }

    if (contenidoFinal === null) {
      // Se agotaron las iteraciones sin una respuesta de texto: forzamos
      // handoff (docs/05-ai-engine.md §7) en vez de dejar al cliente sin
      // respuesta.
      if (!seDerivoAHumano) {
        await this.functionExecutor.ejecutar(
          'derivar_a_humano',
          { motivo: 'La IA no pudo resolver la consulta en el máximo de pasos permitido' },
          { empresaId: job.empresaId, clienteId: job.clienteId, conversacionId: job.conversacionId },
        );
        funcionesLlamadas.push('derivar_a_humano');
      }
      contenidoFinal =
        'Ya te derivo con un asesor para ayudarte mejor con esto, en un momento te responde.';
    }

    const latenciaMs = Date.now() - inicio;

    const mensajeIA = await this.prisma.mensaje.create({
      data: {
        conversacionId: job.conversacionId,
        emisor: 'IA',
        tipo: 'TEXTO',
        contenido: contenidoFinal,
        tokensUsados: tokensPrompt + tokensCompletion,
        costoUsd: estimarCostoUsd(modelo, tokensPrompt, tokensCompletion),
      },
    });

    await this.prisma.conversacion.update({
      where: { id: job.conversacionId },
      data: { ultimoMensajeAt: mensajeIA.createdAt },
    });

    await this.prisma.logIA.create({
      data: {
        empresaId: job.empresaId,
        mensajeId: job.mensajeId,
        promptEnviado,
        respuestaCruda: contenidoFinal,
        funcionLlamada: funcionesLlamadas.length ? funcionesLlamadas.join(',') : null,
        tokensPrompt,
        tokensCompletion,
        costoUsd: estimarCostoUsd(modelo, tokensPrompt, tokensCompletion),
        latenciaMs,
      },
    });

    // El envío real por WhatsApp/Instagram lo hace el worker de canal
    // (Notifications, todavía no construido) que consume esta cola.
    await this.sendMessageQueue.add('send-message', {
      empresaId: job.empresaId,
      conversacionId: job.conversacionId,
      mensajeId: mensajeIA.id,
      clienteId: job.clienteId,
      canal: job.canal,
      contenido: contenidoFinal,
    });

    if (mensajeCliente?.contenido) {
      this.memoryUpdater.actualizar(job.clienteId, mensajeCliente.contenido, contenidoFinal);
    }
  }

  private parsearArgumentos(argumentosJson: string): Record<string, any> {
    try {
      return JSON.parse(argumentosJson || '{}');
    } catch {
      return {};
    }
  }
}
