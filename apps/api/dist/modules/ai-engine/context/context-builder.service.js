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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBuilderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const N_MENSAJES_CONTEXTO = 20;
const CONFIG_IA_DEFAULT = {
    tono: null,
    reglasNegocioJson: null,
    modeloOpenai: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 600,
    horarioAtencionJson: null,
    condicionesHandoffJson: null,
};
let ContextBuilderService = class ContextBuilderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async build(empresaId, conversacionId, clienteId) {
        const [empresa, configIA, promptSistema, cliente, mensajes] = await Promise.all([
            this.prisma.empresa.findUnique({ where: { id: empresaId } }),
            this.prisma.configuracionIA.findUnique({ where: { empresaId } }),
            this.prisma.prompt.findFirst({
                where: { empresaId, tipo: 'SYSTEM', activo: true },
                orderBy: { version: 'desc' },
            }),
            this.prisma.cliente.findUnique({ where: { id: clienteId } }),
            this.prisma.mensaje.findMany({
                where: { conversacionId },
                orderBy: { createdAt: 'desc' },
                take: N_MENSAJES_CONTEXTO,
            }),
        ]);
        if (!empresa)
            throw new common_1.NotFoundException('Empresa no encontrada');
        if (!cliente)
            throw new common_1.NotFoundException('Cliente no encontrado');
        return {
            empresa,
            configIA: configIA ?? CONFIG_IA_DEFAULT,
            promptSistemaPersonalizado: promptSistema?.contenido,
            cliente,
            historialReciente: mensajes.reverse(),
        };
    }
};
exports.ContextBuilderService = ContextBuilderService;
exports.ContextBuilderService = ContextBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContextBuilderService);
//# sourceMappingURL=context-builder.service.js.map