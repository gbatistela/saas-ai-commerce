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
exports.CarritosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const INCLUDE_ITEMS = {
    items: {
        include: {
            variante: { include: { producto: true, stock: true } },
        },
    },
};
let CarritosService = class CarritosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtenerActivoOCrear(empresaId, clienteId) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { id: clienteId, empresaId, deletedAt: null },
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        let carrito = await this.prisma.carrito.findFirst({
            where: { empresaId, clienteId, estado: 'ACTIVO' },
            include: INCLUDE_ITEMS,
            orderBy: { createdAt: 'desc' },
        });
        if (!carrito) {
            carrito = await this.prisma.carrito.create({
                data: { empresaId, clienteId, estado: 'ACTIVO' },
                include: INCLUDE_ITEMS,
            });
        }
        return carrito;
    }
    async agregarItem(empresaId, carritoId, dto) {
        const carrito = await this.buscarActivoOFallar(empresaId, carritoId);
        const variante = await this.prisma.variante.findFirst({
            where: { id: dto.varianteId, producto: { empresaId, deletedAt: null } },
            include: { producto: true, stock: true },
        });
        if (!variante) {
            throw new common_1.NotFoundException('Variante no encontrada');
        }
        const itemExistente = await this.prisma.carritoItem.findUnique({
            where: {
                carritoId_varianteId: { carritoId, varianteId: dto.varianteId },
            },
        });
        const cantidadFinal = (itemExistente?.cantidad ?? 0) + dto.cantidad;
        this.verificarStock(variante, cantidadFinal);
        const precioUnitario = Number(variante.producto.precio) + Number(variante.precioAdicional);
        await this.prisma.carritoItem.upsert({
            where: {
                carritoId_varianteId: { carritoId, varianteId: dto.varianteId },
            },
            create: {
                carritoId,
                varianteId: dto.varianteId,
                cantidad: dto.cantidad,
                precioUnitario,
            },
            update: { cantidad: cantidadFinal, precioUnitario },
        });
        await this.prisma.carrito.update({
            where: { id: carritoId },
            data: { ultimaActividadAt: new Date() },
        });
        return this.obtenerConItems(carritoId);
    }
    async actualizarItem(empresaId, carritoId, itemId, dto) {
        await this.buscarActivoOFallar(empresaId, carritoId);
        const item = await this.buscarItemOFallar(carritoId, itemId);
        const variante = await this.prisma.variante.findUnique({
            where: { id: item.varianteId },
            include: { stock: true },
        });
        this.verificarStock(variante, dto.cantidad);
        await this.prisma.carritoItem.update({
            where: { id: itemId },
            data: { cantidad: dto.cantidad },
        });
        await this.prisma.carrito.update({
            where: { id: carritoId },
            data: { ultimaActividadAt: new Date() },
        });
        return this.obtenerConItems(carritoId);
    }
    async eliminarItem(empresaId, carritoId, itemId) {
        await this.buscarActivoOFallar(empresaId, carritoId);
        await this.buscarItemOFallar(carritoId, itemId);
        await this.prisma.carritoItem.delete({ where: { id: itemId } });
        await this.prisma.carrito.update({
            where: { id: carritoId },
            data: { ultimaActividadAt: new Date() },
        });
        return this.obtenerConItems(carritoId);
    }
    verificarStock(variante, cantidadRequerida) {
        const disponible = variante.stock.reduce((sum, s) => sum + s.cantidad, 0);
        if (disponible < cantidadRequerida) {
            throw new common_1.ConflictException(`Stock insuficiente: disponible ${disponible}, solicitado ${cantidadRequerida}`);
        }
    }
    obtenerConItems(carritoId) {
        return this.prisma.carrito.findUnique({
            where: { id: carritoId },
            include: INCLUDE_ITEMS,
        });
    }
    async buscarActivoOFallar(empresaId, carritoId) {
        const carrito = await this.prisma.carrito.findFirst({
            where: { id: carritoId, empresaId },
        });
        if (!carrito) {
            throw new common_1.NotFoundException('Carrito no encontrado');
        }
        if (carrito.estado !== 'ACTIVO') {
            throw new common_1.ConflictException('El carrito ya no está activo');
        }
        return carrito;
    }
    async buscarItemOFallar(carritoId, itemId) {
        const item = await this.prisma.carritoItem.findFirst({
            where: { id: itemId, carritoId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item no encontrado en el carrito');
        }
        return item;
    }
};
exports.CarritosService = CarritosService;
exports.CarritosService = CarritosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CarritosService);
//# sourceMappingURL=carritos.service.js.map