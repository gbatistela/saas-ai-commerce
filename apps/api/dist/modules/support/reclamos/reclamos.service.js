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
exports.ReclamosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
let ReclamosService = class ReclamosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(empresaId, dto) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { id: dto.clienteId, empresaId, deletedAt: null },
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        if (dto.pedidoId) {
            const pedido = await this.prisma.pedido.findFirst({
                where: { id: dto.pedidoId, empresaId },
            });
            if (!pedido) {
                throw new common_1.NotFoundException('Pedido no encontrado');
            }
        }
        return this.prisma.reclamo.create({
            data: { ...dto, empresaId },
        });
    }
    async listar(empresaId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
            empresaId,
            ...(query.estado ? { estado: query.estado } : {}),
            ...(query.prioridad ? { prioridad: query.prioridad } : {}),
            ...(query.asignadoA ? { asignadoAId: query.asignadoA } : {}),
            ...(query.cliente ? { clienteId: query.cliente } : {}),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.reclamo.findMany({
                where,
                include: {
                    cliente: { select: { id: true, nombre: true, telefono: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.reclamo.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async obtener(empresaId, id) {
        const reclamo = await this.prisma.reclamo.findFirst({
            where: { id, empresaId },
            include: {
                cliente: { select: { id: true, nombre: true, telefono: true } },
                pedido: { select: { id: true, numeroPedido: true } },
                archivos: { include: { archivo: true } },
            },
        });
        if (!reclamo) {
            throw new common_1.NotFoundException('Reclamo no encontrado');
        }
        return reclamo;
    }
    async actualizar(empresaId, id, dto) {
        await this.buscarOFallar(empresaId, id);
        if (dto.asignadoAId) {
            const usuario = await this.prisma.usuario.findFirst({
                where: { id: dto.asignadoAId, empresaId, deletedAt: null },
            });
            if (!usuario) {
                throw new common_1.NotFoundException('Usuario no encontrado en esta empresa');
            }
        }
        return this.prisma.reclamo.update({ where: { id }, data: dto });
    }
    async agregarArchivo(empresaId, id, dto) {
        await this.buscarOFallar(empresaId, id);
        const archivo = await this.prisma.archivo.create({
            data: {
                empresaId,
                url: dto.url,
                tipoMime: dto.tipoMime,
                tamanoBytes: dto.tamanoBytes,
                bucket: dto.bucket,
            },
        });
        return this.prisma.archivoReclamo.create({
            data: { reclamoId: id, archivoId: archivo.id, tipo: dto.tipo },
            include: { archivo: true },
        });
    }
    async buscarOFallar(empresaId, id) {
        const reclamo = await this.prisma.reclamo.findFirst({
            where: { id, empresaId },
        });
        if (!reclamo) {
            throw new common_1.NotFoundException('Reclamo no encontrado');
        }
        return reclamo;
    }
};
exports.ReclamosService = ReclamosService;
exports.ReclamosService = ReclamosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReclamosService);
//# sourceMappingURL=reclamos.service.js.map