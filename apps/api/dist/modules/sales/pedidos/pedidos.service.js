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
exports.PedidosService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const INCLUDE_DETALLE = {
    items: { include: { variante: { include: { producto: true } } } },
    estados: { orderBy: { createdAt: 'desc' } },
    pagos: true,
    seguimiento: true,
    cliente: { select: { id: true, nombre: true, telefono: true } },
};
let PedidosService = class PedidosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crearDesdeCarrito(empresaId, dto, usuarioId) {
        const carrito = await this.prisma.carrito.findFirst({
            where: { id: dto.carritoId, empresaId, estado: 'ACTIVO' },
            include: {
                items: { include: { variante: { include: { stock: true } } } },
            },
        });
        if (!carrito) {
            throw new common_1.NotFoundException('Carrito no encontrado o ya no está activo');
        }
        if (carrito.items.length === 0) {
            throw new common_1.ConflictException('El carrito no tiene items');
        }
        for (const item of carrito.items) {
            const disponible = item.variante.stock.reduce((sum, s) => sum + s.cantidad, 0);
            if (disponible < item.cantidad) {
                throw new common_1.ConflictException(`Stock insuficiente para la variante ${item.varianteId}`);
            }
        }
        if (dto.direccionId) {
            const direccion = await this.prisma.direccion.findFirst({
                where: { id: dto.direccionId, clienteId: carrito.clienteId },
            });
            if (!direccion) {
                throw new common_1.NotFoundException('Dirección no encontrada para el cliente');
            }
        }
        const subtotal = carrito.items.reduce((sum, item) => sum + item.cantidad * Number(item.precioUnitario), 0);
        for (let intento = 0; intento < 3; intento++) {
            const numeroPedido = await this.siguienteNumeroPedido(empresaId);
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const pedido = await tx.pedido.create({
                        data: {
                            empresaId,
                            clienteId: carrito.clienteId,
                            carritoId: carrito.id,
                            numeroPedido,
                            subtotal,
                            descuentoTotal: 0,
                            envio: 0,
                            total: subtotal,
                            direccionId: dto.direccionId,
                            items: {
                                create: carrito.items.map((item) => ({
                                    varianteId: item.varianteId,
                                    cantidad: item.cantidad,
                                    precioUnitario: item.precioUnitario,
                                    subtotal: item.cantidad * Number(item.precioUnitario),
                                })),
                            },
                            estados: {
                                create: {
                                    estado: 'PENDIENTE',
                                    usuarioId,
                                },
                            },
                        },
                        include: INCLUDE_DETALLE,
                    });
                    await tx.carrito.update({
                        where: { id: carrito.id },
                        data: { estado: 'CONVERTIDO' },
                    });
                    return pedido;
                });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002') {
                    continue;
                }
                throw error;
            }
        }
        throw new common_1.ConflictException('No se pudo generar un número de pedido único, reintentá');
    }
    async listar(empresaId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        let idsPorEstado;
        if (query.estado) {
            const filas = await this.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT p.id FROM pedidos p
        WHERE p.empresa_id = ${empresaId}
        AND (
          SELECT eph.estado FROM estados_pedido eph
          WHERE eph.pedido_id = p.id
          ORDER BY eph.created_at DESC
          LIMIT 1
        ) = ${query.estado}::"EstadoPedidoEnum"
      `);
            idsPorEstado = filas.map((f) => f.id);
        }
        const where = {
            empresaId,
            ...(idsPorEstado ? { id: { in: idsPorEstado } } : {}),
            ...(query.cliente ? { clienteId: query.cliente } : {}),
            ...(query.fechaDesde || query.fechaHasta
                ? {
                    createdAt: {
                        ...(query.fechaDesde ? { gte: new Date(query.fechaDesde) } : {}),
                        ...(query.fechaHasta ? { lte: new Date(query.fechaHasta) } : {}),
                    },
                }
                : {}),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.pedido.findMany({
                where,
                include: {
                    cliente: { select: { id: true, nombre: true, telefono: true } },
                    estados: { orderBy: { createdAt: 'desc' }, take: 1 },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.pedido.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async obtener(empresaId, id) {
        const pedido = await this.prisma.pedido.findFirst({
            where: { id, empresaId },
            include: INCLUDE_DETALLE,
        });
        if (!pedido) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        return pedido;
    }
    async actualizarEstado(empresaId, id, dto, usuarioId) {
        await this.buscarOFallar(empresaId, id);
        await this.prisma.estadoPedidoHistorial.create({
            data: {
                pedidoId: id,
                estado: dto.estado,
                comentario: dto.comentario,
                usuarioId,
            },
        });
        return this.obtener(empresaId, id);
    }
    async agregarSeguimiento(empresaId, id, dto) {
        await this.buscarOFallar(empresaId, id);
        return this.prisma.seguimientoEnvio.create({
            data: { pedidoId: id, ...dto },
        });
    }
    async estadoPorNumero(empresaId, numeroPedido) {
        const pedido = await this.prisma.pedido.findFirst({
            where: { empresaId, numeroPedido },
            include: {
                estados: { orderBy: { createdAt: 'desc' } },
                seguimiento: true,
            },
        });
        if (!pedido) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        return {
            numeroPedido: pedido.numeroPedido,
            estadoActual: pedido.estados[0]?.estado ?? null,
            historial: pedido.estados,
            seguimiento: pedido.seguimiento,
            total: pedido.total,
        };
    }
    async siguienteNumeroPedido(empresaId) {
        const total = await this.prisma.pedido.count({ where: { empresaId } });
        return String(total + 1).padStart(6, '0');
    }
    async buscarOFallar(empresaId, id) {
        const pedido = await this.prisma.pedido.findFirst({
            where: { id, empresaId },
        });
        if (!pedido) {
            throw new common_1.NotFoundException('Pedido no encontrado');
        }
        return pedido;
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PedidosService);
//# sourceMappingURL=pedidos.service.js.map