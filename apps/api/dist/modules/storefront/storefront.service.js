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
exports.StorefrontService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../infra/prisma/prisma.service");
const productos_service_1 = require("../catalog/productos/productos.service");
const categorias_service_1 = require("../catalog/categorias/categorias.service");
const carritos_service_1 = require("../sales/carritos/carritos.service");
const pedidos_service_1 = require("../sales/pedidos/pedidos.service");
const clientes_service_1 = require("../crm/clientes/clientes.service");
let StorefrontService = class StorefrontService {
    constructor(prisma, productosService, categoriasService, carritosService, pedidosService, clientesService) {
        this.prisma = prisma;
        this.productosService = productosService;
        this.categoriasService = categoriasService;
        this.carritosService = carritosService;
        this.pedidosService = pedidosService;
        this.clientesService = clientesService;
    }
    async resolverEmpresa(slug) {
        const empresa = await this.prisma.empresa.findUnique({ where: { slug } });
        if (!empresa || empresa.estado !== 'ACTIVO') {
            throw new common_1.NotFoundException('Tienda no encontrada');
        }
        return empresa;
    }
    async obtenerInfo(slug) {
        const empresa = await this.resolverEmpresa(slug);
        return {
            nombre: empresa.nombre,
            logoUrl: empresa.logoUrl,
            moneda: empresa.moneda,
            rubro: empresa.rubro,
        };
    }
    async listarProductos(slug, query) {
        const empresa = await this.resolverEmpresa(slug);
        return this.productosService.listar(empresa.id, { ...query, estado: 'ACTIVO' });
    }
    async obtenerProducto(slug, productoId) {
        const empresa = await this.resolverEmpresa(slug);
        const producto = await this.productosService.obtener(empresa.id, productoId);
        if (producto.estado !== 'ACTIVO') {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return producto;
    }
    async listarCategorias(slug) {
        const empresa = await this.resolverEmpresa(slug);
        return this.categoriasService.listar(empresa.id);
    }
    async obtenerCarrito(slug, sessionId) {
        const empresa = await this.resolverEmpresa(slug);
        const cliente = await this.obtenerOCrearClienteAnonimo(empresa.id, sessionId);
        return this.carritosService.obtenerActivoOCrear(empresa.id, cliente.id);
    }
    async agregarItem(slug, dto) {
        const empresa = await this.resolverEmpresa(slug);
        const cliente = await this.obtenerOCrearClienteAnonimo(empresa.id, dto.sessionId);
        const carrito = await this.carritosService.obtenerActivoOCrear(empresa.id, cliente.id);
        return this.carritosService.agregarItem(empresa.id, carrito.id, {
            varianteId: dto.varianteId,
            cantidad: dto.cantidad,
        });
    }
    async actualizarItem(slug, itemId, dto) {
        const empresa = await this.resolverEmpresa(slug);
        const carritoId = await this.verificarItemDeSesion(empresa.id, dto.sessionId, itemId);
        return this.carritosService.actualizarItem(empresa.id, carritoId, itemId, {
            cantidad: dto.cantidad,
        });
    }
    async eliminarItem(slug, itemId, sessionId) {
        const empresa = await this.resolverEmpresa(slug);
        const carritoId = await this.verificarItemDeSesion(empresa.id, sessionId, itemId);
        return this.carritosService.eliminarItem(empresa.id, carritoId, itemId);
    }
    async checkout(slug, dto) {
        const empresa = await this.resolverEmpresa(slug);
        const clienteAnonimo = await this.obtenerOCrearClienteAnonimo(empresa.id, dto.sessionId);
        let clienteFinal = await this.prisma.cliente.findFirst({
            where: { empresaId: empresa.id, telefono: dto.telefono, deletedAt: null },
        });
        if (!clienteFinal) {
            clienteFinal = await this.prisma.cliente.update({
                where: { id: clienteAnonimo.id },
                data: {
                    telefono: dto.telefono,
                    nombre: dto.nombre,
                    email: dto.email,
                    canalOrigen: 'WEB',
                },
            });
        }
        else if (clienteFinal.id !== clienteAnonimo.id) {
            await this.prisma.carrito.updateMany({
                where: { clienteId: clienteAnonimo.id, estado: 'ACTIVO' },
                data: { clienteId: clienteFinal.id },
            });
        }
        const carrito = await this.prisma.carrito.findFirst({
            where: { clienteId: clienteFinal.id, estado: 'ACTIVO' },
        });
        if (!carrito) {
            throw new common_1.ConflictException('El carrito está vacío');
        }
        let direccionId;
        if (dto.direccion) {
            const direccion = await this.clientesService.agregarDireccion(empresa.id, clienteFinal.id, {
                ...dto.direccion,
                esPrincipal: true,
            });
            direccionId = direccion.id;
        }
        return this.pedidosService.crearDesdeCarrito(empresa.id, {
            carritoId: carrito.id,
            direccionId,
        });
    }
    async estadoPedido(slug, numeroPedido, contacto) {
        const empresa = await this.resolverEmpresa(slug);
        const pedido = await this.prisma.pedido.findFirst({
            where: { empresaId: empresa.id, numeroPedido },
            include: {
                cliente: { select: { telefono: true, email: true } },
                estados: { orderBy: { createdAt: 'desc' } },
                seguimiento: true,
            },
        });
        const coincide = pedido && (pedido.cliente.telefono === contacto || pedido.cliente.email === contacto);
        if (!coincide) {
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
    async obtenerOCrearClienteAnonimo(empresaId, sessionId) {
        const telefonoAnonimo = `web:${sessionId}`;
        const existente = await this.prisma.cliente.findFirst({
            where: { empresaId, telefono: telefonoAnonimo },
        });
        if (existente)
            return existente;
        return this.prisma.cliente.create({
            data: { empresaId, telefono: telefonoAnonimo, canalOrigen: 'WEB' },
        });
    }
    async verificarItemDeSesion(empresaId, sessionId, itemId) {
        const cliente = await this.obtenerOCrearClienteAnonimo(empresaId, sessionId);
        const item = await this.prisma.carritoItem.findFirst({
            where: { id: itemId, carrito: { clienteId: cliente.id } },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item no encontrado en tu carrito');
        }
        return item.carritoId;
    }
};
exports.StorefrontService = StorefrontService;
exports.StorefrontService = StorefrontService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        productos_service_1.ProductosService,
        categorias_service_1.CategoriasService,
        carritos_service_1.CarritosService,
        pedidos_service_1.PedidosService,
        clientes_service_1.ClientesService])
], StorefrontService);
//# sourceMappingURL=storefront.service.js.map