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
exports.CategoriasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
let CategoriasService = class CategoriasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(empresaId) {
        return this.prisma.categoria.findMany({
            where: { empresaId, categoriaPadreId: null },
            include: {
                subcategorias: {
                    include: { subcategorias: true },
                },
            },
            orderBy: { nombre: 'asc' },
        });
    }
    async crear(empresaId, dto) {
        if (dto.categoriaPadreId) {
            await this.buscarOFallar(empresaId, dto.categoriaPadreId);
        }
        return this.prisma.categoria.create({
            data: { ...dto, empresaId },
        });
    }
    async actualizar(empresaId, id, dto) {
        await this.buscarOFallar(empresaId, id);
        if (dto.categoriaPadreId) {
            if (dto.categoriaPadreId === id) {
                throw new common_1.ConflictException('Una categoría no puede ser su propia categoría padre');
            }
            const nuevoPadre = await this.buscarOFallar(empresaId, dto.categoriaPadreId);
            if (nuevoPadre.categoriaPadreId === id) {
                throw new common_1.ConflictException('No se puede crear una referencia circular entre categorías');
            }
        }
        return this.prisma.categoria.update({ where: { id }, data: dto });
    }
    async buscarOFallar(empresaId, id) {
        const categoria = await this.prisma.categoria.findFirst({
            where: { id, empresaId },
        });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoría no encontrada');
        }
        return categoria;
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriasService);
//# sourceMappingURL=categorias.service.js.map