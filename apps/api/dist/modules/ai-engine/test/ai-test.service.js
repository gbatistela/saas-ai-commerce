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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const ai_provider_interface_1 = require("../providers/ai-provider.interface");
const prompt_assembler_service_1 = require("../prompts/prompt-assembler.service");
const CONFIG_IA_DEFAULT = {
    tono: null,
    reglasNegocioJson: null,
    modeloOpenai: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 600,
    horarioAtencionJson: null,
    condicionesHandoffJson: null,
};
let AiTestService = class AiTestService {
    constructor(prisma, aiProvider, promptAssembler) {
        this.prisma = prisma;
        this.aiProvider = aiProvider;
        this.promptAssembler = promptAssembler;
    }
    async probar(empresaId, historial) {
        const [empresa, configIA, promptSistema] = await Promise.all([
            this.prisma.empresa.findUnique({ where: { id: empresaId } }),
            this.prisma.configuracionIA.findUnique({ where: { empresaId } }),
            this.prisma.prompt.findFirst({
                where: { empresaId, tipo: 'SYSTEM', activo: true },
                orderBy: { version: 'desc' },
            }),
        ]);
        if (!empresa) {
            throw new common_1.NotFoundException('Empresa no encontrada');
        }
        const contexto = {
            empresa,
            configIA: configIA ?? CONFIG_IA_DEFAULT,
            promptSistemaPersonalizado: promptSistema?.contenido,
            cliente: this.clienteSintetico(empresaId),
            historialReciente: historial.map((m, i) => this.mensajeSintetico(m, i)),
        };
        const mensajes = this.promptAssembler.assemble(contexto);
        const respuesta = await this.aiProvider.generarRespuesta({
            mensajes,
            funciones: [],
            modelo: contexto.configIA.modeloOpenai,
            temperature: contexto.configIA.temperature,
            maxTokens: contexto.configIA.maxTokens,
        });
        return respuesta.contenido ?? '(el modelo no devolvió texto)';
    }
    clienteSintetico(empresaId) {
        return {
            id: 'test-cliente',
            empresaId,
            nombre: null,
            telefono: null,
            email: null,
            canalOrigen: 'MANUAL',
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
    mensajeSintetico(m, index) {
        return {
            id: `test-mensaje-${index}`,
            conversacionId: 'test-conversacion',
            emisor: m.emisor,
            tipo: 'TEXTO',
            contenido: m.contenido,
            archivoId: null,
            tokensUsados: null,
            costoUsd: null,
            intencionDetectada: null,
            sentimiento: null,
            createdAt: new Date(),
        };
    }
};
exports.AiTestService = AiTestService;
exports.AiTestService = AiTestService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(ai_provider_interface_1.AI_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, prompt_assembler_service_1.PromptAssemblerService])
], AiTestService);
//# sourceMappingURL=ai-test.service.js.map