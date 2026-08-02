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
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const CONFIGURACION_IA_DEFAULT_LECTURA = {
    tono: null,
    reglasNegocioJson: null,
    modeloOpenai: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 600,
    horarioAtencionJson: null,
    condicionesHandoffJson: null,
};
const CONFIGURACION_IA_DEFAULT_CREATE = {
    modeloOpenai: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 600,
    reglasNegocioJson: client_1.Prisma.JsonNull,
    horarioAtencionJson: client_1.Prisma.JsonNull,
    condicionesHandoffJson: client_1.Prisma.JsonNull,
};
let EmpresaService = class EmpresaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtener(empresaId) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { id: empresaId },
        });
        if (!empresa) {
            throw new common_1.NotFoundException('Empresa no encontrada');
        }
        return empresa;
    }
    async actualizar(empresaId, dto) {
        await this.obtener(empresaId);
        return this.prisma.empresa.update({
            where: { id: empresaId },
            data: dto,
        });
    }
    async obtenerConfiguracionIA(empresaId) {
        const config = await this.prisma.configuracionIA.findUnique({
            where: { empresaId },
        });
        return config ?? { empresaId, ...CONFIGURACION_IA_DEFAULT_LECTURA };
    }
    async actualizarConfiguracionIA(empresaId, dto) {
        const { reglasNegocioJson, horarioAtencionJson, condicionesHandoffJson, ...resto } = dto;
        return this.prisma.configuracionIA.upsert({
            where: { empresaId },
            create: {
                empresaId,
                ...CONFIGURACION_IA_DEFAULT_CREATE,
                ...resto,
                ...(reglasNegocioJson !== undefined
                    ? { reglasNegocioJson: reglasNegocioJson }
                    : {}),
                ...(horarioAtencionJson !== undefined
                    ? { horarioAtencionJson: horarioAtencionJson }
                    : {}),
                ...(condicionesHandoffJson !== undefined
                    ? { condicionesHandoffJson: condicionesHandoffJson }
                    : {}),
            },
            update: {
                ...resto,
                ...(reglasNegocioJson !== undefined
                    ? { reglasNegocioJson: reglasNegocioJson }
                    : {}),
                ...(horarioAtencionJson !== undefined
                    ? { horarioAtencionJson: horarioAtencionJson }
                    : {}),
                ...(condicionesHandoffJson !== undefined
                    ? { condicionesHandoffJson: condicionesHandoffJson }
                    : {}),
            },
        });
    }
    async listarPrompts(empresaId) {
        return this.prisma.prompt.findMany({
            where: { empresaId, activo: true },
            orderBy: { tipo: 'asc' },
        });
    }
    async actualizarPrompt(empresaId, tipo, dto) {
        return this.prisma.$transaction(async (tx) => {
            const actual = await tx.prompt.findFirst({
                where: { empresaId, tipo, activo: true },
            });
            if (actual) {
                await tx.prompt.update({
                    where: { id: actual.id },
                    data: { activo: false },
                });
            }
            return tx.prompt.create({
                data: {
                    empresaId,
                    tipo,
                    contenido: dto.contenido,
                    version: (actual?.version ?? 0) + 1,
                    activo: true,
                },
            });
        });
    }
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map