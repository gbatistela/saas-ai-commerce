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
var FunctionExecutorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionExecutorService = void 0;
const common_1 = require("@nestjs/common");
const productos_service_1 = require("../../catalog/productos/productos.service");
const carritos_service_1 = require("../../sales/carritos/carritos.service");
const pedidos_service_1 = require("../../sales/pedidos/pedidos.service");
const reclamos_service_1 = require("../../support/reclamos/reclamos.service");
const conversaciones_service_1 = require("../../conversations/conversaciones/conversaciones.service");
let FunctionExecutorService = FunctionExecutorService_1 = class FunctionExecutorService {
    constructor(productosService, carritosService, pedidosService, reclamosService, conversacionesService) {
        this.productosService = productosService;
        this.carritosService = carritosService;
        this.pedidosService = pedidosService;
        this.reclamosService = reclamosService;
        this.conversacionesService = conversacionesService;
        this.logger = new common_1.Logger(FunctionExecutorService_1.name);
    }
    async ejecutar(nombreFuncion, argumentos, contexto) {
        try {
            switch (nombreFuncion) {
                case 'buscar_productos':
                    return await this.productosService.buscarParaIA(contexto.empresaId, {
                        query: argumentos.query,
                        categoriaNombre: argumentos.categoria,
                        precioMax: argumentos.precioMax,
                    });
                case 'consultar_stock':
                    return await this.productosService.stockDeVariante(contexto.empresaId, argumentos.varianteId);
                case 'agregar_al_carrito': {
                    const carrito = await this.carritosService.obtenerActivoOCrear(contexto.empresaId, contexto.clienteId);
                    return await this.carritosService.agregarItem(contexto.empresaId, carrito.id, {
                        varianteId: argumentos.varianteId,
                        cantidad: argumentos.cantidad,
                    });
                }
                case 'crear_pedido': {
                    const carrito = await this.carritosService.obtenerActivoOCrear(contexto.empresaId, contexto.clienteId);
                    return await this.pedidosService.crearDesdeCarrito(contexto.empresaId, {
                        carritoId: carrito.id,
                        direccionId: argumentos.direccionId,
                    });
                }
                case 'consultar_estado_pedido':
                    return await this.pedidosService.estadoPorNumero(contexto.empresaId, argumentos.numeroPedido);
                case 'crear_reclamo':
                    return await this.reclamosService.crear(contexto.empresaId, {
                        clienteId: contexto.clienteId,
                        pedidoId: argumentos.pedidoId,
                        tipo: 'reportado_por_ia',
                        descripcion: argumentos.descripcion,
                    });
                case 'derivar_a_humano':
                    await this.conversacionesService.actualizarEstado(contexto.empresaId, contexto.conversacionId, { estado: 'HANDOFF' });
                    return { derivado: true, motivo: argumentos.motivo };
                default:
                    return { error: `Función desconocida: ${nombreFuncion}` };
            }
        }
        catch (error) {
            const mensaje = error instanceof common_1.HttpException
                ? error.getResponse()?.message ?? error.message
                : 'Error interno al ejecutar la función';
            this.logger.warn(`Función "${nombreFuncion}" falló: ${mensaje}`);
            return { error: mensaje };
        }
    }
};
exports.FunctionExecutorService = FunctionExecutorService;
exports.FunctionExecutorService = FunctionExecutorService = FunctionExecutorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [productos_service_1.ProductosService,
        carritos_service_1.CarritosService,
        pedidos_service_1.PedidosService,
        reclamos_service_1.ReclamosService,
        conversaciones_service_1.ConversacionesService])
], FunctionExecutorService);
//# sourceMappingURL=function-executor.service.js.map