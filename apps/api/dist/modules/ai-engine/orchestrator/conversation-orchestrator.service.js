"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ConversationOrchestratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const queue_constants_1 = require("../../../infra/queue/queue.constants");
const ai_provider_interface_1 = require("../providers/ai-provider.interface");
const openai_pricing_1 = require("../providers/openai-pricing");
const context_builder_service_1 = require("../context/context-builder.service");
const prompt_assembler_service_1 = require("../prompts/prompt-assembler.service");
const funciones_1 = require("../functions/definitions/funciones");
const function_executor_service_1 = require("../functions/function-executor.service");
const memory_updater_service_1 = require("../memory/memory-updater.service");
const MAX_ITERACIONES_FUNCTION_CALLING = 3;
let ConversationOrchestratorService = ConversationOrchestratorService_1 = class ConversationOrchestratorService {
    constructor(prisma, aiProvider, contextBuilder, promptAssembler, functionExecutor, memoryUpdater, sendMessageQueue) {
        this.prisma = prisma;
        this.aiProvider = aiProvider;
        this.contextBuilder = contextBuilder;
        this.promptAssembler = promptAssembler;
        this.functionExecutor = functionExecutor;
        this.memoryUpdater = memoryUpdater;
        this.sendMessageQueue = sendMessageQueue;
        this.logger = new common_1.Logger(ConversationOrchestratorService_1.name);
    }
    async handle(job) {
        const conversacion = await this.prisma.conversacion.findUnique({
            where: { id: job.conversacionId },
        });
        if (!conversacion || conversacion.empresaId !== job.empresaId) {
            this.logger.warn(`Conversación ${job.conversacionId} no encontrada, se descarta el job`);
            return;
        }
        if (conversacion.estado !== 'ABIERTA') {
            this.logger.log(`Conversación ${job.conversacionId} en estado ${conversacion.estado}, la IA no responde`);
            return;
        }
        const mensajeCliente = await this.prisma.mensaje.findUnique({
            where: { id: job.mensajeId },
        });
        const contexto = await this.contextBuilder.build(job.empresaId, job.conversacionId, job.clienteId);
        const mensajes = this.promptAssembler.assemble(contexto);
        const promptEnviado = mensajes.map((m) => `[${m.role}] ${m.content ?? ''}`).join('\n');
        const modelo = contexto.configIA.modeloOpenai;
        const temperature = contexto.configIA.temperature;
        const maxTokens = contexto.configIA.maxTokens;
        const inicio = Date.now();
        let tokensPrompt = 0;
        let tokensCompletion = 0;
        const funcionesLlamadas = [];
        let contenidoFinal = null;
        let seDerivoAHumano = false;
        for (let iteracion = 0; iteracion < MAX_ITERACIONES_FUNCTION_CALLING; iteracion++) {
            const respuesta = await this.aiProvider.generarRespuesta({
                mensajes,
                funciones: seDerivoAHumano ? [] : funciones_1.FUNCIONES_DISPONIBLES,
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
            if (!seDerivoAHumano) {
                await this.functionExecutor.ejecutar('derivar_a_humano', { motivo: 'La IA no pudo resolver la consulta en el máximo de pasos permitido' }, { empresaId: job.empresaId, clienteId: job.clienteId, conversacionId: job.conversacionId });
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
                costoUsd: (0, openai_pricing_1.estimarCostoUsd)(modelo, tokensPrompt, tokensCompletion),
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
                costoUsd: (0, openai_pricing_1.estimarCostoUsd)(modelo, tokensPrompt, tokensCompletion),
                latenciaMs,
            },
        });
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
    parsearArgumentos(argumentosJson) {
        try {
            return JSON.parse(argumentosJson || '{}');
        }
        catch {
            return {};
        }
    }
};
exports.ConversationOrchestratorService = ConversationOrchestratorService;
exports.ConversationOrchestratorService = ConversationOrchestratorService = ConversationOrchestratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(ai_provider_interface_1.AI_PROVIDER)),
    __param(6, (0, bullmq_1.InjectQueue)(queue_constants_1.SEND_MESSAGE_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, context_builder_service_1.ContextBuilderService,
        prompt_assembler_service_1.PromptAssemblerService,
        function_executor_service_1.FunctionExecutorService,
        memory_updater_service_1.MemoryUpdaterService,
        bullmq_2.Queue])
], ConversationOrchestratorService);
//# sourceMappingURL=conversation-orchestrator.service.js.map