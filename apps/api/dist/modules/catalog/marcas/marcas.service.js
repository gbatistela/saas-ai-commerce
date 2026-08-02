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
exports.MarcasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
let MarcasService = class MarcasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(empresaId) {
        return this.prisma.marca.findMany({
            where: { empresaId },
            orderBy: { nombre: 'asc' },
        });
    }
    async crear(empresaId, dto) {
        const enUso = await this.prisma.marca.findFirst({
            where: { empresaId, nombre: dto.nombre },
        });
        if (enUso) {
            throw new common_1.ConflictException('Ya existe una marca con ese nombre');
        }
        return this.prisma.marca.create({ data: { ...dto, empresaId } });
    }
};
exports.MarcasService = MarcasService;
exports.MarcasService = MarcasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarcasService);
//# sourceMappingURL=marcas.service.js.map