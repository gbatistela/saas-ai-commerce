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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pedidos_service_1 = require("./pedidos.service");
const create_pedido_dto_1 = require("./dto/create-pedido.dto");
const query_pedidos_dto_1 = require("./dto/query-pedidos.dto");
const actualizar_estado_pedido_dto_1 = require("./dto/actualizar-estado-pedido.dto");
const create_seguimiento_dto_1 = require("./dto/create-seguimiento.dto");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let PedidosController = class PedidosController {
    constructor(pedidosService) {
        this.pedidosService = pedidosService;
    }
    crear(user, dto) {
        return this.pedidosService.crearDesdeCarrito(user.empresaId, dto, user.userId);
    }
    listar(user, query) {
        return this.pedidosService.listar(user.empresaId, query);
    }
    estadoPublico(numeroPedido, empresaId) {
        if (!empresaId) {
            throw new common_1.BadRequestException('empresaId es requerido');
        }
        return this.pedidosService.estadoPorNumero(empresaId, numeroPedido);
    }
    obtener(user, id) {
        return this.pedidosService.obtener(user.empresaId, id);
    }
    actualizarEstado(user, id, dto) {
        return this.pedidosService.actualizarEstado(user.empresaId, id, dto, user.userId);
    }
    agregarSeguimiento(user, id, dto) {
        return this.pedidosService.agregarSeguimiento(user.empresaId, id, dto);
    }
};
exports.PedidosController = PedidosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pedido_dto_1.CreatePedidoDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "crear", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_pedidos_dto_1.QueryPedidosDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "listar", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('numero/:numeroPedido/estado'),
    (0, swagger_1.ApiQuery)({
        name: 'empresaId',
        required: true,
        description: 'Sin JWT no hay forma de saber a qué empresa pertenece el número de pedido; para consulta pública real desde la tienda se usa el endpoint de Storefront (con el slug en la URL). Este existe sobre todo para uso interno del AI Engine.',
    }),
    __param(0, (0, common_1.Param)('numeroPedido')),
    __param(1, (0, common_1.Query)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "estadoPublico", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "obtener", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, actualizar_estado_pedido_dto_1.ActualizarEstadoPedidoDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "actualizarEstado", null);
__decorate([
    (0, common_1.Post)(':id/seguimiento'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_seguimiento_dto_1.CreateSeguimientoDto]),
    __metadata("design:returntype", void 0)
], PedidosController.prototype, "agregarSeguimiento", null);
exports.PedidosController = PedidosController = __decorate([
    (0, swagger_1.ApiTags)('pedidos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('pedidos'),
    __metadata("design:paramtypes", [pedidos_service_1.PedidosService])
], PedidosController);
//# sourceMappingURL=pedidos.controller.js.map