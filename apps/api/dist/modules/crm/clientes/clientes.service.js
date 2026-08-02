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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
let ClientesService = class ClientesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(empresaId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
            empresaId,
            deletedAt: null,
            ...(query.nombre
                ? { nombre: { contains: query.nombre, mode: 'insensitive' } }
                : {}),
            ...(query.telefono ? { telefono: { contains: query.telefono } } : {}),
            ...(query.esFrecuente !== undefined
                ? { esFrecuente: query.esFrecuente === 'true' }
                : {}),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.cliente.findMany({
                where,
                orderBy: { [query.sort ?? 'createdAt']: query.order ?? 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.cliente.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async obtener(empresaId, id) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { id, empresaId, deletedAt: null },
            include: {
                direcciones: true,
                etiquetas: { include: { etiqueta: true } },
                pedidos: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: { estados: { orderBy: { createdAt: 'desc' }, take: 1 } },
                },
            },
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return cliente;
    }
    async crear(empresaId, dto) {
        const enUso = await this.prisma.cliente.findFirst({
            where: { empresaId, telefono: dto.telefono },
        });
        if (enUso) {
            throw new common_1.ConflictException('Ya existe un cliente con ese teléfono');
        }
        return this.prisma.cliente.create({
            data: { ...dto, empresaId, canalOrigen: 'MANUAL' },
        });
    }
    async actualizar(empresaId, id, dto) {
        await this.buscarOFallar(empresaId, id);
        if (dto.telefono) {
            const enUso = await this.prisma.cliente.findFirst({
                where: { empresaId, telefono: dto.telefono, NOT: { id } },
            });
            if (enUso) {
                throw new common_1.ConflictException('Ya existe un cliente con ese teléfono');
            }
        }
        return this.prisma.cliente.update({ where: { id }, data: dto });
    }
    async agregarDireccion(empresaId, clienteId, dto) {
        await this.buscarOFallar(empresaId, clienteId);
        if (dto.esPrincipal) {
            await this.prisma.direccion.updateMany({
                where: { clienteId },
                data: { esPrincipal: false },
            });
        }
        return this.prisma.direccion.create({
            data: { ...dto, clienteId },
        });
    }
    async historial(empresaId, clienteId, query) {
        await this.buscarOFallar(empresaId, clienteId);
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = { clienteId };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.historialInteraccion.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.historialInteraccion.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async buscarOFallar(empresaId, id) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { id, empresaId, deletedAt: null },
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return cliente;
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map